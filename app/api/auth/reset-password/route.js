import { getDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

/**
 * POST /api/auth/reset-password - Request password reset
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return Response.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      // Don't reveal if email exists for security
      return Response.json({
        success: true,
        message: 'If email exists, reset link has been sent'
      })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpires: expiresAt
        }
      }
    )

    // In production, send email with reset link
    // For demo, we'll log it
    console.log(
      `Password reset for ${email}: http://localhost:3000/auth/reset-password?token=${resetToken}`
    )

    return Response.json({
      success: true,
      message: 'If email exists, reset link has been sent',
      // For demo purposes only - remove in production
      _resetLink: `http://localhost:3000/auth/reset-password?token=${resetToken}`
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
