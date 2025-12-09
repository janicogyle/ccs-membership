"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Clapperboard,
  Rocket,
  CheckCircle2,
  Clock,
  Shield,
  Database,
  Globe,
  Users,
} from "lucide-react";

const organizations = [
  {
    icon: Laptop,
    gradient: "from-blue-500 to-blue-600",
    title: "ELITES",
    description:
      "BSIT Student Council - Leaders in Information Technology, fostering innovation and excellence.",
  },
  {
    icon: Clapperboard,
    gradient: "from-purple-500 to-purple-600",
    title: "SPECS",
    description:
      "BSCS Organization - Specialists in Computing Sciences, driving research and development.",
  },
  {
    icon: Rocket,
    gradient: "from-orange-500 to-orange-600",
    title: "IMAGES",
    description:
      "BSEMC Organization - Champions of multimedia storytelling and digital experiences.",
  },
  {
    icon: Users,
    gradient: "from-emerald-500 to-emerald-600",
    title: "Student Council",
    description:
      "Whole CCS Department - Unified leadership supporting every CCS student community.",
  },
];

const benefits = [
  {
    icon: CheckCircle2,
    title: "Eliminates Manual Cash Handling",
    description: "Digital payments remove the hassle and risks of managing physical cash.",
    border: "border-l-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Clock,
    title: "Reduces Waiting Times & Physical Queuing",
    description: "Process payments instantly from anywhere, eliminating long lines.",
    border: "border-l-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Secure & User-Friendly Payment Platform",
    description: "Bank-level security with an intuitive interface for all users.",
    border: "border-l-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Database,
    title: "Automated Record-Keeping & Financial Tracking",
    description: "Complete transaction history and financial reports at your fingertips.",
    border: "border-l-purple-500",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Clock,
    title: "Real-Time Transaction Monitoring",
    description: "Track all payments as they happen with instant notifications.",
    border: "border-l-teal-500",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    icon: Globe,
    title: "Accessible Anytime, Anywhere",
    description: "Pay your membership dues 24/7 from any device with internet access.",
    border: "border-l-pink-500",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Database,
    title: "Enhanced Transparency & Accountability",
    description: "Complete audit trails ensure transparent financial operations.",
    border: "border-l-indigo-500",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: Users,
    title: "Designed for Every CCS Member",
    description: "Purpose-built for BSIT, BSCS, BSEMC students and the CCS Student Council.",
    border: "border-l-amber-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              <span className="text-orange-600">Gordon College</span>
              <br />
              <span className="text-orange-600">College of Computer Studies</span>
              <br />
              Membership Portal
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl"
          >
            A secure, modern digital platform for BSIT, BSCS, and BSEMC students to conveniently pay membership dues
            online. Streamlining financial management for ELITES, SPECS, IMAGES, and the CCS Student Council.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/auth/signup"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium text-white transition-all bg-orange-600 hover:bg-orange-700"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Community Badge */}
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-block rounded-full bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700">
            OUR COMMUNITY
          </div>
        </div>
      </section>

      {/* Organizations */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">CCS Student Organizations</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Four organizations, one unified system supporting BSIT, BSCS, BSEMC, and the entire CCS department at Gordon College
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {organizations.map((org, index) => (
              <motion.div
                key={org.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-lg border bg-white p-8 transition-all duration-300 hover:shadow-xl border-2 hover:border-orange-200">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${org.gradient}`}>
                    <org.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{org.title}</h3>
                  <p className="leading-relaxed text-gray-600">{org.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-700">
              WHY CHOOSE US
            </button>
          </div>
        </div>
      </section>

      {/* System Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">System Benefits</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Addressing the challenges of manual fee collection through digital transformation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.floor(index / 2) * 0.1 }}
              >
                <div className={`rounded-lg border bg-white p-6 border-l-4 ${benefit.border} transition-shadow hover:shadow-lg`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${benefit.iconBg}`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900 md:text-xl">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 md:text-base">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Supporting Gordon College&apos;s Digital Transformation
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-orange-100 md:text-xl">
                This system highlights Gordon College&apos;s commitment to innovation and digital transformation. By
                integrating technology into organizational operations, we ensure that CCS student services remain
                future-ready, sustainable, and accessible.
              </p>
              <Link
                href="/about"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-medium text-orange-600 transition-all hover:bg-orange-50"
              >
                Learn More About Our Mission
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2 text-gray-400">© 2025 CCS MemberLink. All rights reserved.</p>
            <p className="text-sm text-gray-500">Supporting Gordon College&apos;s Digital Transformation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
