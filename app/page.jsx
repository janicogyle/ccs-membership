import { FeatureList } from "@/components/organisms";
import { Card } from "@/components/molecules";
import { PageTemplate } from "@/components/templates";
import { Button } from "@/components/atoms";
import Link from "next/link";

export default function Home() {
  const features = [
    "Eliminates Manual Cash Handling",
    "Reduces Waiting Times & Physical Queuing",
    "Secure & User-Friendly Payment Platform",
    "Automated Record-Keeping & Financial Tracking",
    "Real-Time Transaction Monitoring",
    "Enhanced Transparency & Accountability",
    "Accessible Anytime, Anywhere",
    "Designed for BSIT, BSEMC, and BSCS Students",
  ];

  return (
    <PageTemplate>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-slate-50 overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">
                  Gordon College CCS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                <span className="text-slate-900 block mb-2">Student Council &</span>
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent block mb-2">Organization</span>
                <span className="text-slate-900 block mb-2">Online Membership</span>
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent block">Payment System</span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                A secure digital platform for BSIT, BSEMC, and BSCS students to conveniently pay membership dues online. Streamlining financial management for ELITES, SPECS, and IMAGES organizations.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link href="/auth/signup">
                  <button className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                    Get Started
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button className="px-8 py-4 text-base font-bold text-orange-600 bg-white border-2 border-orange-500 hover:bg-orange-50 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizations Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Our Community</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">CCS Student Organizations</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three organizations, one unified system supporting BSIT, BSEMC, and BSCS programs at Gordon College
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              href="/students"
              title="ELITES"
              description="BSIT Student Council - Leaders in Information Technology, fostering innovation and excellence."
            />

            <Card
              href="/about"
              title="SPECS"
              description="BSEMC Organization - Specialists in Entertainment and Multimedia Computing creativity."
            />

            <Card
              href="/contact"
              title="IMAGES"
              description="BSCS Organization - Masters of Computer Science, advancing technology and research."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">System Benefits</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Addressing the challenges of manual fee collection through digital transformation
            </p>
          </div>
          <FeatureList features={features} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 md:mb-6">
            Supporting Gordon College's Digital Transformation
          </h2>
          <p className="text-base md:text-lg text-orange-50 leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto">
            This system highlights Gordon College's commitment to innovation and digital transformation. By integrating technology into organizational operations, we ensure that CCS student services remain future-ready, sustainable, and accessible.
          </p>
          <Link href="/about">
            <button className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold text-orange-600 bg-white hover:bg-orange-50 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all">
              Learn More About Our Mission
            </button>
          </Link>
        </div>
      </section>
    </PageTemplate>
  );
}
