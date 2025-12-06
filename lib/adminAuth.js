import { verifyToken } from './auth'

/**
 * Verify admin role from token
 * @param {Request} request - The incoming request
 * @returns {Object|null} - Decoded token with admin check, or null if not admin
 */
export function verifyAdmin(request) {
  const decoded = verifyToken(request)
  if (!decoded || !decoded.isAdmin) {
    return null
  }
  return decoded
}

/**
 * HOC for protecting admin API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - Wrapped handler with admin check
 */
export function withAdmin(handler) {
  return async (request) => {
    const admin = verifyAdmin(request)
    if (!admin) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Admin access required'
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
    return handler(request, admin)
  }
}

/**
 * Check if user is admin
 * @param {Object} decoded - Decoded JWT token
 * @returns {boolean} - True if user is admin
 */
export function isAdmin(decoded) {
  return decoded && decoded.isAdmin === true
}
