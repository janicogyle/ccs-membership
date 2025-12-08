'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Laptop, Clapperboard, Rocket, CheckCircle2, Clock, Shield, Database, Globe, Users, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full mb-8">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-700">Student Council & Organization Portal</span>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-6xl md:text-7xl lg:text-8xl font-black mb-8">
            <span className="text-slate-900">Modern</span><br /><span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Membership</span><br /><span className="text-slate-900">Payment System</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            A secure, modern digital platform for BSIT, BSEMC, and BSCS students. Streamlining financial management for ELITES, IMAGES, and SPECS organizations.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/signup" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">Get Started<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
            <Link href="/auth/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg border-2 border-orange-600 hover:bg-orange-50 hover:scale-105 transition-all">Login</Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
