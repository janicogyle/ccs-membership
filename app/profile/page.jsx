'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const ORGANIZATION_LABELS = {
  BSIT: 'ELITES',
  BSCS: 'SPECS',
  BSEMC: 'IMAGES',
};

const formatDate = (date) => {
  if (!date) return null;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser, authReady } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    block: '',
    program: '',
    year: '',
    createdAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [organizationStatus, setOrganizationStatus] = useState({ state: 'Inactive', expiresAt: null });
  const [councilStatus, setCouncilStatus] = useState({ state: 'Inactive', expiresAt: null });
  const [profileDocId, setProfileDocId] = useState(null);

  useEffect(() => {
    if (!authReady || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authReady, isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!authReady || isLoading || !user?.uid) {
      return;
    }

    fetchProfile();
    fetchMembershipStatus();
  }, [authReady, isLoading, user?.uid]);

  const organizationName = useMemo(() => {
    return ORGANIZATION_LABELS[profileData.program] || 'Organization';
  }, [profileData.program]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      let snapshot = await getDoc(userDocRef);

      if (!snapshot.exists()) {
        const altQuery = query(
          collection(db, 'users'),
          where('uid', '==', user.uid),
          limit(1)
        );
        const altSnapshot = await getDocs(altQuery);
        if (!altSnapshot.empty) {
          snapshot = altSnapshot.docs[0];
          setProfileDocId(snapshot.id);
        }
      } else {
        setProfileDocId(user.uid);
      }

      if (snapshot.exists()) {
        const data = snapshot.data();

        const nameSource = data.name ?? data.profile?.name ?? user.name ?? '';
        let inferredFirstName = '';
        let inferredLastName = '';

        if ((!data.firstName && !data.firstname) && nameSource) {
          const parts = nameSource.trim().split(' ');
          inferredFirstName = parts[0] ?? '';
          inferredLastName = parts.slice(1).join(' ') || '';
        }

        const derivedProfile = {
          firstName:
            data.firstName ??
            data.firstname ??
            data.profile?.firstName ??
            data.profile?.firstname ??
            user.firstName ??
            inferredFirstName ??
            '',
          lastName:
            data.lastName ??
            data.lastname ??
            data.profile?.lastName ??
            data.profile?.lastname ??
            user.lastName ??
            inferredLastName ??
            '',
          email:
            data.email ??
            data.profile?.email ??
            user.email ??
            '',
          phoneNumber:
            data.phoneNumber ??
            data.phone ??
            data.profile?.phoneNumber ??
            data.profile?.phone ??
            user.phoneNumber ??
            '',
          block:
            data.block ??
            data.profile?.block ??
            user.block ??
            '',
          program:
            data.program ??
            data.profile?.program ??
            user.program ??
            '',
          year:
            data.year ??
            data.profile?.year ??
            user.year ??
            '',
          createdAt: data.createdAt ?? data.profile?.createdAt ?? null,
        };

        setProfileData(derivedProfile);
      } else {
        const sourceName = user.name || '';
        let fallbackFirst = user.firstName || '';
        let fallbackLast = user.lastName || '';

        if (!fallbackFirst && sourceName) {
          const parts = sourceName.trim().split(' ');
          fallbackFirst = parts[0] ?? '';
          fallbackLast = parts.slice(1).join(' ') || '';
        }

        setProfileData({
          firstName: fallbackFirst,
          lastName: fallbackLast,
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          block: user.block || '',
          program: user.program || '',
          year: user.year || '',
          createdAt: null,
        });
        setProfileDocId(user.uid);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Unable to load profile details right now.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipStatus = async () => {
    if (!user?.uid) return;

    try {
      const now = new Date();
      setOrganizationStatus({ state: 'Inactive', expiresAt: null });
      setCouncilStatus({ state: 'Inactive', expiresAt: null });

      const orgQuery = query(
        collection(db, 'subscriptions'),
        where('userId', '==', user.uid),
        where('type', 'in', ['half', 'full']),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const orgSnapshot = await getDocs(orgQuery);
      if (!orgSnapshot.empty) {
        const subscription = orgSnapshot.docs[0].data();
        const endDate = subscription.endDate?.toDate?.();
        if (!endDate || endDate > now) {
          setOrganizationStatus({ state: 'Active', expiresAt: endDate || null });
        }
      }

      const councilQuery = query(
        collection(db, 'subscriptions'),
        where('userId', '==', user.uid),
        where('subscriptionType', '==', 'council'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const councilSnapshot = await getDocs(councilQuery);
      if (!councilSnapshot.empty) {
        const councilSubscription = councilSnapshot.docs[0].data();
        const endDate = councilSubscription.endDate?.toDate?.();
        if (!endDate || endDate > now) {
          setCouncilStatus({ state: 'Active', expiresAt: endDate || null });
        }
      }
    } catch (err) {
      console.error('Error fetching membership status:', err);
    }
  };

  const handleFieldChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSave = async (event) => {
    event?.preventDefault();
    if (!user?.uid) return;

    try {
      setSaving(true);
      setError('');
      const timestamp = new Date();
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        phoneNumber: profileData.phoneNumber,
        block: profileData.block,
        program: profileData.program,
        year: profileData.year,
        updatedAt: timestamp,
      };

      if (profileDocId) {
        await updateDoc(doc(db, 'users', profileDocId), payload);
      } else {
        await setDoc(doc(db, 'users', user.uid), { ...payload, uid: user.uid, email: user.email, createdAt: timestamp }, { merge: true });
        setProfileDocId(user.uid);
      }

      updateUser?.({
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        block: payload.block,
        program: payload.program,
        year: payload.year,
        name: payload.name,
      });

      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError('');
    setSuccess(false);
    fetchProfile();
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Profile</p>
            <h1 className="text-3xl font-bold text-gray-900">Account Overview</h1>
            <p className="text-sm text-gray-600">Manage your CCS membership details and personal information.</p>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-700"
            >
              Edit profile
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Profile updated successfully!
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-orange-600 shadow-lg">
                {(profileData.firstName || profileData.email)?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white">
                  {profileData.firstName || profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`.trim()
                    : 'Unnamed Member'}
                </h2>
                <p className="mt-2 text-orange-100">{profileData.email}</p>
                {profileData.createdAt?.seconds && (
                  <p className="mt-3 text-sm text-orange-100/80">
                    Member since{' '}
                    {formatDate(new Date(profileData.createdAt.seconds * 1000))}
                  </p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8 px-8 py-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">First name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                ) : (
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-800">
                    {profileData.firstName || '—'}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Last name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                ) : (
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-800">
                    {profileData.lastName || '—'}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Email address</label>
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-base font-medium text-gray-600">
                  {profileData.email}
                </div>
                <p className="mt-1 text-xs text-gray-500">Email updates require contacting support.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Phone number</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="09XX-XXX-XXXX"
                  />
                ) : (
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-800">
                    {profileData.phoneNumber || '—'}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Block</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileData.block}
                    onChange={(e) => handleFieldChange('block', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g., BSIT 3A"
                  />
                ) : (
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-800">
                    {profileData.block || '—'}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Program</label>
                {editMode ? (
                  <select
                    value={profileData.program}
                    onChange={(e) => handleFieldChange('program', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Select program</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSEMC">BSEMC</option>
                  </select>
                ) : (
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-800">
                    {profileData.program || '—'}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Year level</label>
                {editMode ? (
                  <select
                    value={profileData.year}
                    onChange={(e) => handleFieldChange('year', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                ) : (
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-800">
                    {profileData.year || '—'}
                  </p>
                )}
              </div>
            </div>

            {editMode && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Membership status</h3>
          <p className="mt-1 text-sm text-gray-600">
            Track which CCS organizations you are actively subscribed to. Status reflects recent payments recorded in the system.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Program organization</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{organizationName}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    organizationStatus.state === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {organizationStatus.state}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                {organizationStatus.state === 'Active'
                  ? `Membership is active${
                      organizationStatus.expiresAt
                        ? ` until ${formatDate(organizationStatus.expiresAt)}`
                        : ''
                    }.`
                  : 'Complete a payment to activate your organization membership.'}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Student council</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">CCS Student Council</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    councilStatus.state === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {councilStatus.state}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                {councilStatus.state === 'Active'
                  ? `Council dues are settled${
                      councilStatus.expiresAt ? ` until ${formatDate(councilStatus.expiresAt)}` : ''
                    }.`
                  : 'Pay council dues to activate your CCS Student Council membership.'}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          Need help updating your account? Contact your organization representative or email the CCS Student Council support team.
        </div>
      </div>
    </div>
  );
}
