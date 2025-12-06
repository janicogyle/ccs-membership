import { registerUser } from '@/lib/firebaseAuthService'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    // Validation
    if (!email || !name || !password) {
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

    const result = await registerUser(email, name, password)

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
      updatedAt: new Date(),
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          _id: result.insertedId.toString(),
          email,
          name,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
