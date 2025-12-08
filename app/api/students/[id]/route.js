import { getStudentById, updateStudent, deleteStudent } from '@/lib/firestoreService'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/students/[id]
 * Fetch a single student by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params

    const result = await getStudentById(id)

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          student: result.data,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message || 'Student not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Get student error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * PUT /api/students/[id]
 * Update a student by ID
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const decoded = verifyToken(request)

    if (!decoded) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await request.json()
    const { name, email, gpa, major, enrollmentYear } = body

    // Build update object with provided fields
    const updates = {}
    if (name) updates.name = name
    if (email) updates.email = email
    if (gpa !== undefined) updates.gpa = parseFloat(gpa)
    if (major) updates.major = major
    if (enrollmentYear) updates.enrollmentYear = parseInt(enrollmentYear)

    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No fields to update',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await updateStudent(id, updates)

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Student updated successfully',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message || 'Failed to update student',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Update student error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * DELETE /api/students/[id]
 * Delete a student by ID
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const decoded = verifyToken(request)

    if (!decoded) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await deleteStudent(id)

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Student deleted successfully',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message || 'Failed to delete student',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Delete student error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
