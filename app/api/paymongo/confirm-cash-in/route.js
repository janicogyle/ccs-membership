import { NextResponse } from 'next/server';
import paymongoRequest, { paymongoSimulationEnabled } from '@/lib/paymongo';
import admin, { adminDb, isAdminInitialized } from '@/lib/firebaseAdmin';

export async function POST(req) {
  if (!isAdminInitialized || !adminDb) {
    return NextResponse.json({ error: 'Server wallet service is unavailable. Contact an administrator.' }, { status: 500 });
  }

  try {
    const { sessionId, userId, simulatedAmount } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing PayMongo session identifier.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Missing user reference for wallet credit.' }, { status: 400 });
    }

    const isSimulated = paymongoSimulationEnabled || sessionId.startsWith('sim_');

    let amount = 0;
    let status = 'paid';
    let sessionData = null;

    if (isSimulated) {
      amount = Number(simulatedAmount);
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Simulated payments must include a valid amount.' }, { status: 400 });
      }
      status = 'simulated_paid';
      sessionData = { simulated: true, sessionId, amount, userId };
    } else {
      const session = await paymongoRequest(`/checkout_sessions/${sessionId}`);
      sessionData = session?.data;
      const attributes = sessionData?.attributes;

      if (!sessionData || !attributes) {
        return NextResponse.json({ error: 'Unable to locate the PayMongo checkout session.' }, { status: 404 });
      }

      status = attributes.status;

      if (status !== 'paid') {
        return NextResponse.json({ error: 'Payment is not completed yet.', status }, { status: 409 });
      }

      const metadataUserId = attributes.metadata?.userId;

      if (metadataUserId && metadataUserId !== userId) {
        return NextResponse.json({ error: 'Payment does not belong to the current user.' }, { status: 403 });
      }

      const amountInCentavos = (attributes.line_items || []).reduce((total, item) => {
        const itemAmount = Number(item.amount) || 0;
        const quantity = Number(item.quantity) || 1;
        return total + itemAmount * quantity;
      }, 0);

      amount = amountInCentavos / 100;

      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Resolved PayMongo session has no payable amount.' }, { status: 422 });
      }
    }

    const walletRef = adminDb.collection('wallets').doc(userId);
    const transactionRef = adminDb.collection('transactions').doc(`cashin_${sessionId}`);

    let alreadyProcessed = false;
    let newBalance = 0;

    await adminDb.runTransaction(async (transaction) => {
      const existingTransaction = await transaction.get(transactionRef);
      const walletSnap = await transaction.get(walletRef);

      if (existingTransaction.exists) {
        alreadyProcessed = true;
        newBalance = walletSnap.exists ? walletSnap.data().balance || 0 : 0;
        return;
      }

      const currentBalance = walletSnap.exists ? walletSnap.data().balance || 0 : 0;
      newBalance = currentBalance + amount;

      if (walletSnap.exists) {
        transaction.update(walletRef, {
          balance: newBalance,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        transaction.set(walletRef, {
          userId,
          balance: newBalance,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      transaction.set(transactionRef, {
        checkoutSessionId: sessionId,
        provider: isSimulated ? 'paymongo_simulator' : 'paymongo',
        type: 'cash_in',
        status: 'completed',
        amount,
        currency: 'PHP',
        userId,
        raw: sessionData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    if (alreadyProcessed) {
      return NextResponse.json({ success: true, alreadyProcessed: true, amount, newBalance, status });
    }

    return NextResponse.json({ success: true, amount, newBalance, status });
  } catch (error) {
    console.error('PayMongo cash-in confirmation failed:', error);
    const status = error.status && error.status >= 400 ? error.status : 500;
    return NextResponse.json({ error: error.message || 'Failed to confirm payment with PayMongo.' }, { status });
  }
}