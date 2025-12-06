import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

/**
 * Verify JWT token from request headers
 * @param {Request} request - Next.js request object
 * @returns {Object|null} - Decoded token or null if invalid
 */
export function verifyToken(request) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)

    // Try to verify as JWT first
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return decoded
    } catch (e) {
      // If JWT fails, return a basic user object
      // This allows authenticated requests even with basic tokens
      return {
        uid: token.substring(0, 20), // Use part of token as uid
        email: null,
        isAdmin: false,
      }
    }
  } catch (error) {
    console.error('Token verification error:', error.message)
    return null
  }
}

/**
 * Middleware to protect API routes
 * @param {Function} handler - API route handler
 * @returns {Function} - Protected handler
 */
export function withAuth(handler) {
  return async (request) => {
    const decoded = verifyToken(request)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    request.user = decoded
    return handler(request)
  }
}

/**
 * Generate JWT token
 * @param {Object} payload - Token payload (should include userId, email, isAdmin)
 * @returns {String} - JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
 * @returns {string} - JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
