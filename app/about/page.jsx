'use client';

import { PageTemplate } from '@/components/templates';
import { HeroSection } from '@/components/organisms';
import { Card } from '@/components/molecules';

export default function AboutPage() {
  const values = [
    'Eliminate Manual Cash Handling',
    'Reduce Waiting Times',
    'Secure & User-Friendly',
    'Automated Record-Keeping',
    'Transparency & Accountability',
    'Digital Transformation',
  ];

  return (
    <PageTemplate>
      <HeroSection
        title="About CCS Membership System"
        subtitle="Digital transformation for Gordon College student organizations"
        showLogo={false}
      />

      <div className="flex justify-center">
        <div className="max-w-6xl px-6 py-24 w-full">
          {/* Mission & Values Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mb-24">
          <div className="relative group bg-white rounded-3xl p-10 md:p-14 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  The College of Computer Study Student Council and Organization Online Membership Payment System addresses the challenges of manual fee collection in CCS organizations—ELITES, SPECS, and IMAGES.
                </p>
                <p>
                  By eliminating manual cash handling and physical queuing, we provide a secure, efficient, and transparent platform for BSIT, BSEMC, and BSCS students at Gordon College.
                </p>
              </div>
            </div>
          </div>

          <div className="relative group bg-slate-50 rounded-3xl p-10 md:p-14 border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 text-center">
            <div className="w-16 h-16 mx-auto bg-white text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl px-4 py-3 border border-slate-200 text-sm font-medium text-slate-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-orange-200 hover:text-orange-600 transition-all duration-200"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm mb-2 block">What We Offer</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">System Features</h2>
            <div className="flex justify-center">
              <p className="text-lg text-slate-600 max-w-2xl">Everything you need for membership management</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            <Card
              align="left"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
              title="Online Payment"
              description="Secure digital payment processing for membership dues across ELITES, SPECS, and IMAGES organizations."
            />
            <Card
              align="left"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Real-Time Tracking"
              description="Monitor transactions instantly with automated record-keeping and financial reporting capabilities."
            />
            <Card
              align="left"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              title="Member Management"
              description="Streamlined dashboards for organization officers and members of BSIT, BSEMC, and BSCS programs."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 md:p-16 text-white shadow-xl text-center flex justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
          
          <div className="relative z-10 max-w-3xl w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Gordon College CCS</h2>
            <p className="text-lg leading-relaxed text-orange-50">
              This system is developed for the College of Computer Study at Gordon College, supporting BSIT, BSEMC, and BSCS programs. It reflects our commitment to digital transformation, making student services more modern, efficient, and future-ready while building trust and enhancing convenience for all CCS organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
    </PageTemplate>
  );
}
