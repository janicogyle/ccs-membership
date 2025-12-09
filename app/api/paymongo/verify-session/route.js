import { NextResponse } from 'next/server';

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
    }

    if (!PAYMONGO_SECRET_KEY) {
      return NextResponse.json({ error: 'Payment system not configured.' }, { status: 500 });
    }

    // Retrieve checkout session from PayMongo
    const response = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayMongo API error:', data);
      return NextResponse.json(
        { error: data.errors?.[0]?.detail || 'Failed to verify session.' },
        { status: response.status }
      );
    }

    const session = data.data;
    const attributes = session.attributes;
    const metadata = attributes.metadata || {};
    const paymentStatus = attributes.payment_intent?.attributes?.status || attributes.status;

    // Check if payment was successful
    const isPaid = paymentStatus === 'succeeded' || 
                   paymentStatus === 'paid' || 
                   attributes.payments?.length > 0;

    // Get amount from line items (in centavos, convert to pesos)
    const lineItems = attributes.line_items || [];
    const totalCentavos = lineItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    const amountInPesos = totalCentavos / 100;

    return NextResponse.json({
      success: true,
      isPaid: isPaid,
      status: paymentStatus,
      sessionId: session.id,
      amount: metadata.amount || amountInPesos,
      userId: metadata.userId,
      checkoutUrl: attributes.checkout_url,
      paymentMethodUsed: attributes.payment_method_used,
    });
  } catch (error) {
    console.error('Error verifying PayMongo session:', error);
    return NextResponse.json({ error: 'Failed to verify payment session.' }, { status: 500 });
  }
}
