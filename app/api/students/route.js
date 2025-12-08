import { getAllStudents, createStudent } from '@/lib/firestoreService'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/students
 * Fetch all students
 */
export async function GET(request) {
  try {
    const result = await getAllStudents()

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          students: result.data,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message || 'Failed to fetch students',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Get students error:', error)
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
 * POST /api/students
 * Create a new student (requires authentication)
 */
export async function POST(request) {
  try {
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
    const { name, email, major, gpa, enrollmentYear } = body

    // Validation
    if (!name || !email || !major || gpa === undefined || !enrollmentYear) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const studentData = {
      name,
      email,
      major,
      gpa: parseFloat(gpa),
      enrollmentYear: parseInt(enrollmentYear),
    }

    const result = await createStudent(studentData)

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Student created successfully',
          id: result.id,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message || 'Failed to create student',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Create student error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
