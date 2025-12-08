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

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Mission & Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
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

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl px-4 py-3 border border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2"
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
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need for membership management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              title="Online Payment"
              description="Secure digital payment processing for membership dues across ELITES, SPECS, and IMAGES organizations."
            />
            <Card
              title="Real-Time Tracking"
              description="Monitor transactions instantly with automated record-keeping and financial reporting capabilities."
            />
            <Card
              title="Member Management"
              description="Streamlined dashboards for organization officers and members of BSIT, BSEMC, and BSCS programs."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 md:p-16 text-white shadow-xl text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Gordon College CCS</h2>
            <p className="text-lg leading-relaxed text-orange-50">
              This system is developed for the College of Computer Study at Gordon College, supporting BSIT, BSEMC, and BSCS programs. It reflects our commitment to digital transformation, making student services more modern, efficient, and future-ready while building trust and enhancing convenience for all CCS organizations.
            </p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
