'use client';

import { PageTemplate } from '@/components/templates';
import { HeroSection, FeatureList } from '@/components/organisms';
import { Card } from '@/components/molecules';
import { Text } from '@/components/atoms';

export default function AboutPage() {
  const values = [
    'Excellence in Education',
    'Innovation & Technology',
    'Community Driven',
    'Student Focused',
    'Accessibility First',
    'Continuous Improvement',
  ];

  return (
    <PageTemplate>
      <HeroSection
        title="About CCS Membership"
        subtitle="Empowering student communities through modern technology"
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Computer Science Society (CCS) Membership system is dedicated to
              creating an efficient, modern platform for managing student memberships
              and community engagement.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe that technology should empower communities, not complicate
              them. Our platform makes it easy for students to connect, share, and
              grow together.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="grid grid-cols-2 gap-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <p className="text-blue-900 font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              title="Student Directory"
              description="Browse and discover members of the computer science community"
            />
            <Card
              title="Secure Authentication"
              description="Safe login and registration with industry-standard security"
            />
            <Card
              title="Community Management"
              description="Tools to connect, communicate, and collaborate effectively"
            />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Team</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The CCS Membership system is built and maintained by a dedicated team of
            computer science students and professionals who are passionate about
            creating excellent software and supporting our community.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
