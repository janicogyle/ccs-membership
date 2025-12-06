import { getDatabase } from '@/lib/mongodb'
import { withAdmin } from '@/lib/adminAuth'
import { ObjectId } from 'mongodb'

/**
 * GET /api/admin/users/[id] - Get user details (admin only)
 * PUT /api/admin/users/[id] - Update user (admin only)
 * DELETE /api/admin/users/[id] - Delete user (admin only)
 */
export const GET = withAdmin(async (request, admin, params) => {
  try {
    const id = params.id
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      message: 'User retrieved successfully',
      user
    })
  } catch (error) {
    console.error('Failed to get user:', error)
    return Response.json(
      { success: false, message: 'Failed to get user' },
      { status: 500 }
    )
  }
})

export const PUT = withAdmin(async (request, admin, params) => {
  try {
    const id = params.id
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { name, email, isAdmin: newIsAdmin } = data

    const db = getDatabase()

    // Check if email is being changed to an existing one
    if (email) {
      const existing = await db
        .collection('users')
        .findOne({ email, _id: { $ne: new ObjectId(id) } })
      if (existing) {
        return Response.json(
          { success: false, message: 'Email already in use' },
          { status: 400 }
        )
      }
    }

    const updateData = { updatedAt: new Date() }
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (typeof newIsAdmin === 'boolean') updateData.isAdmin = newIsAdmin

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    )

    if (!result.value) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      message: 'User updated successfully',
      user: result.value
    })
  } catch (error) {
    console.error('Failed to update user:', error)
    return Response.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    )
  }
})

export const DELETE = withAdmin(async (request, admin, params) => {
  try {
    const id = params.id
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Prevent deleting yourself
    if (admin.userId === id) {
      return Response.json(
        { success: false, message: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return Response.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    )
  }
})
