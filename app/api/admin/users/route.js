import { getDatabase } from '@/lib/mongodb'
import { withAdmin } from '@/lib/adminAuth'
import { ObjectId } from 'mongodb'

/**
 * GET /api/admin/users - Get all users (admin only)
 * POST /api/admin/users - Create user (admin only)
 */
export const GET = withAdmin(async (request, admin) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const skip = (page - 1) * limit

    const db = getDatabase()
    const users = await db
      .collection('users')
      .find({})
      .skip(skip)
      .limit(limit)
      .project({ password: 0 })
      .toArray()

    const total = await db.collection('users').countDocuments()

    return Response.json({
      success: true,
      message: 'Users retrieved successfully',
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to get users:', error)
    return Response.json(
      { success: false, message: 'Failed to get users' },
      { status: 500 }
    )
  }
})

export const POST = withAdmin(async (request, admin) => {
  try {
    const data = await request.json()
    const { name, email, password, isAdmin: newIsAdmin } = data

    if (!email || !password || !name) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const existing = await db.collection('users').findOne({ email })
    if (existing) {
      return Response.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      )
    }

    const { hash } = await import('bcryptjs')
    const hashedPassword = await hash(password, 10)

    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      isAdmin: newIsAdmin || false,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return Response.json({
      success: true,
      message: 'User created successfully',
      userId: result.insertedId
    })
  } catch (error) {
    console.error('Failed to create user:', error)
    return Response.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    )
  }
})
