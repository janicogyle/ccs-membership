import { loginUser } from '@/lib/firebaseAuthService'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email and password are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await loginUser(email, password)

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Login failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
