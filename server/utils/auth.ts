/**
 * JWT-based authentication utilities for serverless (Vercel) deployments.
 *
 * Why JWT + httpOnly cookie instead of server-side sessions?
 *   On Vercel's serverless platform, each function invocation may run on a
 *   different container. Server-side session stores (e.g. in-memory, Redis)
 *   are not shared across invocations, so a session created on one cold start
 *   is invisible to the next warm instance. A signed JWT stored in an httpOnly
 *   cookie is self-contained: the server can verify it statelessly on every
 *   request without any shared mutable state.
 *
 * Cookie name: `auth_token`
 */

import { getCookie, setCookie, deleteCookie, type H3Event } from 'h3'
import jwt from 'jsonwebtoken'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface JwtPayload {
  id: string
  email: string
  name: string
  role: string
  iat: number
  exp: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the JWT secret from runtime config or environment variable.
 * Throws a clear error if it's missing (fail fast in production).
 */
function getJwtSecret(): string {
  const config = useRuntimeConfig()
  const secret = (config.jwtSecret as string | undefined) || process.env.JWT_SECRET

  if (!secret) {
    throw new Error(
      'JWT_SECRET is not configured. Set it in nuxt.config.ts runtimeConfig ' +
        'or as an environment variable (process.env.JWT_SECRET). ' +
        'On Vercel, add it in Project Settings → Environment Variables.'
    )
  }

  return secret
}

/**
 * JWT expiry (7 days).
 */
const JWT_EXPIRES_IN = '7d'

/**
 * Cookie name used for the auth token.
 */
export const AUTH_COOKIE_NAME = 'auth_token'

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sign a JWT for the given user and set it as an httpOnly cookie on the response.
 *
 * The cookie is:
 *   - httpOnly  → not accessible via JavaScript (prevents XSS token theft)
 *   - secure    → only sent over HTTPS (required on Vercel)
 *   - sameSite  → 'lax' (works for normal navigation, blocks most CSRF)
 *   - maxAge    → 7 days (matches JWT expiry)
 *   - path      → '/' (available on all routes)
 *
 * @param event   The H3Event from the route handler.
 * @param user    The user object to encode in the JWT.
 */
export function setAuthCookie(event: H3Event, user: AuthUser): void {
  const secret = getJwtSecret()

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  )

  setCookie(event, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: '/',
  })
}

/**
 * Read and verify the JWT from the auth cookie.
 *
 * @param event   The H3Event from the route handler.
 * @returns The decoded user payload, or `null` if the cookie is missing,
 *          expired, or invalid.
 */
export function getAuthUser(event: H3Event): AuthUser | null {
  const token = getCookie(event, AUTH_COOKIE_NAME)

  if (!token) {
    return null
  }

  try {
    const secret = getJwtSecret()
    const decoded = jwt.verify(token, secret) as JwtPayload

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch {
    // Token is expired, malformed, or signed with a different secret.
    // Return null — callers should treat this as "not authenticated".
    return null
  }
}

/**
 * Convenience: verify the JWT and throw a 401 if the user is not authenticated.
 *
 * Use at the top of any protected API route:
 *   const user = requireAuth(event)
 *
 * @param event   The H3Event from the route handler.
 * @returns The authenticated user.
 * @throws  createError({ statusCode: 401 }) if not authenticated.
 */
export function requireAuth(event: H3Event): AuthUser {
  const user = getAuthUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated.',
      data: { message: 'Authentication required. Please log in.' },
    })
  }

  return user
}

/**
 * Clear the auth cookie (logout).
 *
 * @param event   The H3Event from the route handler.
 */
export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, AUTH_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })
}
