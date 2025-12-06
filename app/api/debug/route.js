// Quick Diagnostic Tool
// Run with: npm run dev, then visit http://localhost:3000/api/debug

export async function GET() {
  try {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ SET' : '❌ MISSING',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ SET' : '❌ MISSING',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ SET' : '❌ MISSING',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ SET' : '❌ MISSING',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ SET' : '❌ MISSING',
      adminType: process.env.FIREBASE_ADMIN_TYPE ? '✅ SET' : '❌ MISSING',
      adminProjectId: process.env.FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING',
    }

    const values = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    }

    return new Response(
      JSON.stringify(
        {
          status: 'Firebase Configuration Diagnostic',
          config,
          values,
        },
        null,
        2
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
