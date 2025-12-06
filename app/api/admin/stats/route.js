import { getDatabase } from '@/lib/mongodb'
import { withAdmin } from '@/lib/adminAuth'
import { ObjectId } from 'mongodb'

/**
 * GET /api/admin/stats - Get dashboard statistics (admin only)
 */
export const GET = withAdmin(async (request, admin) => {
  try {
    const db = getDatabase()

    // Get counts
    const totalUsers = await db.collection('users').countDocuments()
    const totalStudents = await db.collection('students').countDocuments()
    const totalAdmins = await db.collection('users').countDocuments({ isAdmin: true })

    // Get recent signups
    const recentUsers = await db
      .collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .project({ password: 0 })
      .toArray()

    // Get recent students added
    const recentStudents = await db
      .collection('students')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get major distribution
    const majorStats = await db
      .collection('students')
      .aggregate([
        { $group: { _id: '$major', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray()

    // Get GPA stats
    const gpaStats = await db
      .collection('students')
      .aggregate([
        {
          $group: {
            _id: null,
            avgGPA: { $avg: '$gpa' },
            maxGPA: { $max: '$gpa' },
            minGPA: { $min: '$gpa' }
          }
        }
      ])
      .toArray()

    return Response.json({
      success: true,
      message: 'Statistics retrieved successfully',
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        recentUsers,
        recentStudents,
        majorStats,
        gpaStats: gpaStats[0] || { avgGPA: 0, maxGPA: 0, minGPA: 0 }
      }
    })
  } catch (error) {
    console.error('Failed to get statistics:', error)
    return Response.json(
      { success: false, message: 'Failed to get statistics' },
      { status: 500 }
    )
  }
})
