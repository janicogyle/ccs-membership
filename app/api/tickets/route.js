import { NextResponse } from 'next/server';
import admin, { adminAuth, adminDb, isAdminInitialized } from '@/lib/firebaseAdmin';

async function authenticate(request) {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return {
      ok: false,
      status: 500,
      error: 'Firebase admin is not configured on the server.',
    };
  }

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : null;

  if (!token) {
    return { ok: false, status: 401, error: 'Missing authorization token.' };
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userSnapshot = await adminDb.collection('users').doc(decoded.uid).get();
    const userData = userSnapshot.exists ? userSnapshot.data() : {};

    return {
      ok: true,
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || userData?.name || '',
      userData,
      isAdmin: Boolean(userData?.isAdmin),
    };
  } catch (error) {
    console.error('Ticket auth error:', error);
    return { ok: false, status: 401, error: 'Invalid or expired token.' };
  }
}

function mapTicket(docSnapshot) {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
    resolvedAt: data.resolvedAt ? data.resolvedAt.toDate().toISOString() : null,
  };
}

export async function GET(request) {
  const authResult = await authenticate(request);
  if (!authResult.ok) {
    return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });
  }

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get('scope') || 'self';

  try {
    const collectionRef = adminDb.collection('tickets');
    let tickets = [];

    if (scope === 'self') {
      const byIdQuery = collectionRef.where('userId', '==', authResult.uid);
      let snapshot = await byIdQuery.get();

      if (snapshot.empty && authResult.email) {
        const byEmailQuery = collectionRef.where('email', '==', authResult.email);
        snapshot = await byEmailQuery.get();
      }

      tickets = snapshot.docs.map(mapTicket);
      tickets.sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return bTime - aTime;
      });
    } else if (scope === 'admin') {
      if (!authResult.isAdmin) {
        return NextResponse.json({ success: false, message: 'Forbidden: admin scope required.' }, { status: 403 });
      }

      const snapshot = await collectionRef.orderBy('createdAt', 'desc').get();
      tickets = snapshot.docs.map(mapTicket);
    } else {
      return NextResponse.json({ success: false, message: 'Invalid scope parameter.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error('Tickets GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch tickets.' }, { status: 500 });
  }
}

export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.ok) {
    return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!subject || !message) {
      return NextResponse.json({ success: false, message: 'Subject and message are required.' }, { status: 400 });
    }

    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const ticketPayload = {
      userId: authResult.uid,
      name: authResult.userData?.name || authResult.name || 'Student',
      email: authResult.userData?.email || authResult.email || '',
      phone: authResult.userData?.phoneNumber || authResult.userData?.phone || '',
      subject,
      message,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      resolvedAt: null,
    };

    const docRef = await adminDb.collection('tickets').add(ticketPayload);
    const createdSnapshot = await docRef.get();
    const createdTicket = mapTicket(createdSnapshot);

    return NextResponse.json({ success: true, data: createdTicket }, { status: 201 });
  } catch (error) {
    console.error('Tickets POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create ticket.' }, { status: 500 });
  }
}
