'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function StudentProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
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
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user?.uid) {
        console.log('No user UID found');
        setLoading(false);
        return;
      }

      console.log('Fetching profile for user:', user.uid);
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('Firestore data:', data);
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || user.email || '',
          phoneNumber: data.phoneNumber || '',
          block: data.block || '',
          program: data.program || '',
          year: data.year || '',
          createdAt: data.createdAt,
        });
      } else {
        console.log('No Firestore document found, using auth context:', user);
        // Use data from auth context if Firestore doc doesn't exist
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          block: user.block || '',
          program: user.program || '',
          year: user.year || '',
          createdAt: null,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback to auth context data
      console.log('Error fallback, using auth context:', user);
      setProfileData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        block: user?.block || '',
        program: user?.program || '',
        year: user?.year || '',
        createdAt: null,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess(false);

      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`,
        phoneNumber: profileData.phoneNumber,
        block: profileData.block,
        program: profileData.program,
        year: profileData.year,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);
      
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
    fetchProfile();
    setError('');
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your personal information</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-700">Profile updated successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-orange-600">
                {profileData.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-orange-100 mt-1">{profileData.email}</p>
              {profileData.createdAt && (
                <p className="text-orange-100 text-sm mt-2">
                  Member since {new Date(profileData.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                First Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-900"
                  placeholder="Enter first name"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                  {profileData.firstName || '-'}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Last Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-900"
                  placeholder="Enter last name"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                  {profileData.lastName || '-'}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <p className="px-4 py-3 bg-slate-100 rounded-lg text-slate-600 font-medium cursor-not-allowed">
                {profileData.email}
              </p>
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-900"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                  {profileData.phoneNumber || '-'}
                </p>
              )}
            </div>

            {/* Block */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Block
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={profileData.block}
                  onChange={(e) => handleChange('block', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-900"
                  placeholder="Enter block"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                  {profileData.block || '-'}
                </p>
              )}
            </div>

            {/* Program */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Program
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={profileData.program}
                  onChange={(e) => handleChange('program', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-900"
                  placeholder="Enter program"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                  {profileData.program || '-'}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Year
              </label>
              {editMode ? (
                <select
                  value={profileData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-slate-900"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-slate-50 rounded-lg text-slate-900 font-medium">
                  {profileData.year || '-'}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons (Edit Mode Only) */}
          {editMode && (
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
