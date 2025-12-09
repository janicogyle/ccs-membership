import { NextResponse } from 'next/server';

// SIMULATION MODE ONLY - No real PayMongo API calls
export async function POST(req) {
  try {
    const { amount, userId } = await req.json();

    // Basic validation
    if (!amount || Number.isNaN(Number(amount))) {
      return NextResponse.json({ error: 'Cash-in amount is required.' }, { status: 400 });
    }

    const pesoAmount = Number(amount);

    if (pesoAmount < 100) {
      return NextResponse.json({ error: 'Minimum cash-in amount is ₱100.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User information is required.' }, { status: 400 });
    }

    // Generate simulated session ID
    const simulatedSessionId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Return URL to success page with simulation flag
    return NextResponse.json({
      checkoutUrl: `/student/cash-in/success?checkout_session_id=${simulatedSessionId}&amount=${pesoAmount}&simulated=true`,
      sessionId: simulatedSessionId,
      simulated: true,
    });
  } catch (error) {
    console.error('Error in simulated checkout:', error);
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 });
  }
}


