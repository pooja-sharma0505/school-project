/**
 * Shared API helpers — error handling, validation, and auth.
 *
 * All server routes should use these helpers so that:
 *  - Errors return proper HTTP status codes (not 200 with { success: false })
 *  - GET routes always return arrays on error (never an object that crashes .filter())
 *  - POST/PUT routes validate input before touching the DB
 *  - Routes can opt-in to auth via requireAuth()
 */

import { createError, getHeader, type EventHandler } from 'h3'

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

/**
 * Wrap an async route handler so that any thrown error is converted into a
 * proper HTTP error response with the correct status code.
 *
 * Usage:
 *   export default defineEventHandler(withErrorHandler(async (event) => { ... }))
 */
export function withErrorHandler<T>(
  handler: (event: any) => Promise<T>
) {
  return async (event: any) => {
    try {
      return await handler(event);
    } catch (error: any) {
      console.error("API ERROR:", error);

      throw createError({
        statusCode: error?.statusCode || 500,
        statusMessage: error?.message || "Internal Server Error",
        data: { message: error?.message || "Internal Server Error" },
      });
    }
  };
}
/**
 * Return a safe empty-array response for GET routes that hit a DB error.
 * This prevents the frontend from receiving an object instead of an array,
 * which would crash .filter() / .length calls in computed properties.
 */
export function safeEmptyArray(error: any): never {
  const status = error?.statusCode || error?.status || 500
  throw createError({
    statusCode: status,
    statusText: status === 500 ? 'Internal Server Error' : undefined,
    data: { message: error?.message || 'Internal server error' },
  })
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export interface ValidationRule {
  field: string
  label: string
  required?: boolean
  type?: 'string' | 'number' | 'date' | 'email'
  min?: number
  max?: number
  enum?: string[]
  custom?: (value: any) => string | null
}

export function validateBody(body: Record<string, any>, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    const value = body[rule.field]

    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      return `${rule.label} is required.`
    }

    // Skip further checks if value is empty and not required
    if (value === undefined || value === null || value === '') {
      continue
    }

    // Type checks
    if (rule.type === 'number') {
      const num = Number(value)
      if (isNaN(num)) {
        return `${rule.label} must be a valid number.`
      }
      if (rule.min !== undefined && num < rule.min) {
        return `${rule.label} must be at least ${rule.min}.`
      }
      if (rule.max !== undefined && num > rule.max) {
        return `${rule.label} must be at most ${rule.max}.`
      }
    }

    if (rule.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(String(value))) {
        return `${rule.label} must be a valid email address.`
      }
    }

    if (rule.type === 'string') {
      const str = String(value)
      if (rule.min !== undefined && str.length < rule.min) {
        return `${rule.label} must be at least ${rule.min} characters.`
      }
      if (rule.max !== undefined && str.length > rule.max) {
        return `${rule.label} must be at most ${rule.max} characters.`
      }
    }

    // Enum check
    if (rule.enum && !rule.enum.includes(String(value))) {
      return `${rule.label} must be one of: ${rule.enum.join(', ')}.`
    }

    // Custom validator
    if (rule.custom) {
      const err = rule.custom(value)
      if (err) return err
    }
  }

  return null
}

/**
 * Throw a 400 error with a validation message.
 */
export function badRequest(message: string): never {
  throw createError({
    statusCode: 400,
    statusText: 'Bad Request',
    data: { message },
  })
}

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------
//
// JWT-based authentication is now handled by ~/server/utils/auth.ts.
// Use requireAuth(event) from that module in any protected API route:
//   import { requireAuth } from '~/server/utils/auth'
//   const user = requireAuth(event)
//
// The old API-key-based requireAuth has been removed to avoid duplicate
// import conflicts. If API-key auth is needed for specific routes, use a
// differently-named function or configure it in a separate utility.
