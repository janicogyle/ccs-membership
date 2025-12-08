import { registerUser } from '@/lib/firebaseAuthService'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, phoneNumber, block, program, year, password } = body

    console.log('Registration request received:', { email, firstName, lastName, phoneNumber, block, program, year });

    // Validation
    if (!email || !firstName || !lastName || !phoneNumber || !block || !program || !year || !password) {
      console.log('Missing fields:', { email: !!email, firstName: !!firstName, lastName: !!lastName, phoneNumber: !!phoneNumber, block: !!block, program: !!program, year: !!year, password: !!password });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Password must be at least 6 characters',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Calling registerUser with:', { email, firstName, lastName, phoneNumber, block, program, year });
    const result = await registerUser(email, password, { firstName, lastName, phoneNumber, block, program, year })
    console.log('Registration result:', result);

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 201 : 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Register error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Registration failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
