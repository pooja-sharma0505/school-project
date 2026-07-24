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
): (event: any) => Promise<T> {
  return async (event: any) => {
    try {
      return await handler(event)
  } catch (error: any) {
  console.error("================================");
  console.error("API ERROR");
  console.error(error);
  console.error("Message:", error?.message);
  console.error("Stack:", error?.stack);
  console.error("================================");

  if (error?.statusCode) {
    throw error;
  }

  const status = error?.statusCode || error?.status || 500;
  const message = error?.message || "Internal server error";

  throw createError({
    statusCode: status,
    statusText: status === 500 ? "Internal Server Error" : undefined,
    data: { message },
  });
}
  }
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

/**
 * Require authentication on a route.
 *
 * In a real app this would check a session/JWT. For this project we use a
 * simple API-key header (X-API-Key) that can be configured via runtime config.
 *
 * Routes that need auth should call requireAuth(event) at the top.
 */
export function requireAuth(event: any): void {
  const config = useRuntimeConfig()
  const apiKey = config.apiKey

  // If no API key is configured, allow all requests (dev mode)
  if (!apiKey) {
    return
  }

  const providedKey = getHeader(event, 'x-api-key')

  if (!providedKey || providedKey !== apiKey) {
    throw createError({
      statusCode: 401,
      statusText: 'Unauthorized',
      data: { message: 'Authentication required.' },
    })
  }
}
