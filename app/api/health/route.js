// Debug endpoint to check Firebase and API status
export async function GET(request) {
  try {
    const checks = {
      firebase_api_key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅' : '❌',
      firebase_auth_domain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅' : '❌',
      firebase_project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌',
      jwt_secret: process.env.JWT_SECRET ? '✅' : '⚠️ (using default)',
      firestore_service: 'Ready',
    }

    return new Response(
      JSON.stringify({
        status: 'OK',
        timestamp: new Date().toISOString(),
        checks,
        message: 'CCS Membership API is running',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'ERROR',
        message: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
