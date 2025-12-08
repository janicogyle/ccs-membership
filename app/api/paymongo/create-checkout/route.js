import { NextResponse } from 'next/server';
import paymongoRequest, { paymongoSimulationEnabled } from '@/lib/paymongo';

function getBaseUrl(req) {
  const origin = req.headers.get('origin');
  if (origin) {
    return origin.replace(/\/$/, '');
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export async function POST(req) {
  try {
    const { amount, userId } = await req.json();

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

    const baseUrl = getBaseUrl(req);
    const amountInCentavos = Math.round(pesoAmount * 100);
        const { amount, userId } = await req.json();
    const body = {
      data: {
        attributes: {
          cancel_url: `${baseUrl}/student/cash-in/cancel`,
          success_url: `${baseUrl}/student/cash-in/success`,
          description: `Wallet cash-in ₱${pesoAmount.toFixed(2)}`,
          send_email_receipt: false,
          show_description: true,
          payment_method_types: ['gcash', 'paymaya', 'card'],
          statement_descriptor: 'CCS Wallet',
          line_items: [
            {
              name: 'CCS Wallet Cash-in',
              description: 'Top-up for CCS MemberLink wallet',
              amount: amountInCentavos,
              currency: 'PHP',
        if (paymongoSimulationEnabled) {
          const fakeSessionId = `sim_${Date.now()}`;
          const successUrl = `${baseUrl}/student/cash-in/success?checkout_session_id=${fakeSessionId}&simulated_amount=${pesoAmount.toFixed(
            2
          )}`;
          return NextResponse.json({ checkoutUrl: successUrl, sessionId: fakeSessionId, simulated: true });
        }

        const amountInCentavos = Math.round(pesoAmount * 100);

        const body = {
          data: {
            attributes: {
              cancel_url: `${baseUrl}/student/cash-in/cancel`,
              success_url: `${baseUrl}/student/cash-in/success`,
              description: `Wallet cash-in ₱${pesoAmount.toFixed(2)}`,
              send_email_receipt: false,
              show_description: true,
              payment_method_types: ['gcash', 'paymaya', 'card'],
              statement_descriptor: 'CCS Wallet',
              line_items: [
                {
                  name: 'CCS Wallet Cash-in',
                  description: 'Top-up for CCS MemberLink wallet',
                  amount: amountInCentavos,
                  currency: 'PHP',
                  quantity: 1,
                },
              ],
              metadata: {
                userId,
                amount: pesoAmount.toFixed(2),
              },
            },
          },
        };

        const checkoutSession = await paymongoRequest('/checkout_sessions', {
          method: 'POST',
          body,
        });

        const checkoutUrl = checkoutSession?.data?.attributes?.checkout_url;
        const sessionId = checkoutSession?.data?.id;

        if (!checkoutUrl || !sessionId) {
          return NextResponse.json({ error: 'Failed to create PayMongo checkout session.' }, { status: 502 });
        }

        return NextResponse.json({ checkoutUrl, sessionId });
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export async function POST(req) {
  try {
    const { amount, userId } = await req.json();

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

    const baseUrl = getBaseUrl(req);
    const amountInCentavos = Math.round(pesoAmount * 100);

