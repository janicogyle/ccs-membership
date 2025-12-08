'use client';

import { useState } from 'react';

export default function MembershipPage() {
  const [selectedOrg, setSelectedOrg] = useState(null);

  const memberships = [
    {
      id: 1,
      name: 'ELITES',
      fullName: 'Excellence in Information Technology Education Society',
      program: 'BSIT',
      status: 'active',
      joinDate: '2025-09-01',
      expiryDate: '2026-06-30',
      fee: 500,
      color: 'blue',
      description: 'The official organization for Bachelor of Science in Information Technology students.',
      benefits: [
        'Access to exclusive IT workshops and seminars',
        'Priority registration for tech events',
        'Networking opportunities with IT professionals',
        'Discounts on organization merchandise',
        'Access to study materials and resources',
      ],
      officers: [
        { name: 'John Doe', position: 'President' },
        { name: 'Jane Smith', position: 'Vice President' },
        { name: 'Mike Johnson', position: 'Secretary' },
      ],
    },
    {
      id: 2,
      name: 'SPECS',
      fullName: 'Society of Progressive Entertainment and Communication Students',
      program: 'BSEMC',
      status: 'inactive',
      joinDate: null,
      expiryDate: null,
      fee: 450,
      color: 'purple',
      description: 'The official organization for Bachelor of Science in Entertainment and Multimedia Computing students.',
      benefits: [
        'Access to multimedia labs and equipment',
        'Exclusive creative workshops',
        'Portfolio building opportunities',
        'Industry connections',
        'Competition participation support',
      ],
      officers: [
        { name: 'Sarah Lee', position: 'President' },
        { name: 'David Park', position: 'Vice President' },
        { name: 'Emma Wilson', position: 'Treasurer' },
      ],
    },
    {
      id: 3,
      name: 'IMAGES',
      fullName: 'Information Management and Computer Science Students',
      program: 'BSCS',
      status: 'inactive',
      joinDate: null,
      expiryDate: null,
      fee: 500,
      color: 'green',
      description: 'The official organization for Bachelor of Science in Computer Science students.',
      benefits: [
        'Advanced programming workshops',
        'Research collaboration opportunities',
        'Career guidance and mentorship',
        'Access to computing resources',
        'Hackathon and competition support',
      ],
      officers: [
        { name: 'Alex Chen', position: 'President' },
        { name: 'Lisa Wang', position: 'Vice President' },
        { name: 'Tom Brown', position: 'Secretary' },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Active Member
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
        Not a Member
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Organization Memberships</h2>
        <p className="text-orange-100">Manage your CCS organization memberships and benefits.</p>
      </div>

      {/* Membership Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {memberships.map((org) => (
          <div
            key={org.id}
            className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-lg transition-all cursor-pointer ${
              org.status === 'active' ? 'border-green-200' : 'border-slate-200'
            }`}
            onClick={() => setSelectedOrg(org)}
          >
            {/* Card Header */}
            <div className={`p-6 bg-gradient-to-br from-${org.color}-500 to-${org.color}-600 rounded-t-xl text-white`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold">{org.name.charAt(0)}</span>
                </div>
                {getStatusBadge(org.status)}
              </div>
              <h3 className="text-xl font-bold mb-1">{org.name}</h3>
              <p className="text-sm text-white/80">{org.program}</p>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{org.description}</p>

              {org.status === 'active' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Member Since</span>
                    <span className="font-semibold text-slate-900">
                      {new Date(org.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Valid Until</span>
                    <span className="font-semibold text-slate-900">
                      {new Date(org.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Membership Fee</span>
                    <span className="text-2xl font-bold text-slate-900">₱{org.fee}</span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
                    Join Now
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal/Card */}
      {selectedOrg && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`p-8 bg-gradient-to-br from-${selectedOrg.color}-500 to-${selectedOrg.color}-600 text-white`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-3xl font-bold">{selectedOrg.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedOrg.name}</h2>
                    <p className="text-white/80">{selectedOrg.fullName}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedOrg.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Member Benefits</h3>
                  <ul className="space-y-2">
                    {selectedOrg.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Organization Officers</h3>
                  <div className="space-y-3">
                    {selectedOrg.officers.map((officer, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-slate-600 font-semibold text-sm">
                            {officer.name.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{officer.name}</p>
                          <p className="text-sm text-slate-500">{officer.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Membership Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Status</span>
                      {getStatusBadge(selectedOrg.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Program</span>
                      <span className="font-semibold text-slate-900">{selectedOrg.program}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Membership Fee</span>
                      <span className="text-xl font-bold text-slate-900">₱{selectedOrg.fee}</span>
                    </div>
                    {selectedOrg.status === 'active' && (
                      <>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                          <span className="text-slate-600">Joined</span>
                          <span className="font-semibold text-slate-900">
                            {new Date(selectedOrg.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Valid Until</span>
                          <span className="font-semibold text-slate-900">
                            {new Date(selectedOrg.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {selectedOrg.status === 'inactive' && (
                    <button className="w-full mt-6 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
                      Join {selectedOrg.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
