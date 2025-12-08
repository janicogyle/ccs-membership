import admin, { adminAuth, adminDb, isAdminInitialized } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

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

export async function PATCH(request, { params }) {
  const authResult = await authenticate(request);
  if (!authResult.ok) {
    return NextResponse.json({ success: false, message: authResult.error }, { status: authResult.status });
  }

  if (!authResult.isAdmin) {
    return NextResponse.json({ success: false, message: 'Forbidden: admin access required.' }, { status: 403 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Ticket ID is required.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const status = body.status?.trim();
    const hasAdminNoteField = Object.prototype.hasOwnProperty.call(body, 'adminNote');
    const adminNote = hasAdminNoteField ? (body.adminNote?.trim() || null) : undefined;

    if (!status) {
      return NextResponse.json({ success: false, message: 'Status is required.' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status value.' }, { status: 400 });
    }

    const docRef = adminDb.collection('tickets').doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      return NextResponse.json({ success: false, message: 'Ticket not found.' }, { status: 404 });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const updatePayload = {
      status,
      updatedAt: now,
    };

    updatePayload.resolvedAt = status === 'resolved' ? now : null;

    if (hasAdminNoteField) {
      updatePayload.adminNote = adminNote;
    }

    await docRef.update(updatePayload);
    const updatedSnapshot = await docRef.get();
    const ticket = mapTicket(updatedSnapshot);

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Ticket PATCH error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update ticket.' }, { status: 500 });
  }
}
