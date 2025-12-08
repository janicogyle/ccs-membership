'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Laptop, Clapperboard, Rocket, CheckCircle2, Clock, Shield, Database, Globe, Users, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full mb-8">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-700">Student Council & Organization Portal</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-8"
          >
            <span className="text-slate-900">Modern</span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Membership</span>
            <br />
            <span className="text-slate-900">Payment System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            A secure, modern digital platform for BSIT, BSEMC, and BSCS students. 
            Streamlining financial management for ELITES, IMAGES, and SPECS organizations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/auth/signup" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg border-2 border-orange-600 hover:bg-orange-50 hover:scale-105 transition-all">
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Organizations Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                Our Community
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black text-slate-900 mb-4"
            >
              CCS Student Organizations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Three organizations, one unified system supporting BSIT, BSEMC, and BSCS programs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Laptop, title: 'ELITES', subtitle: 'BSIT Student Council', desc: 'Leaders in Information Technology, fostering innovation and excellence.', gradient: 'from-blue-500 to-blue-600' },
              { icon: Clapperboard, title: 'SPECS', subtitle: 'BSEMC Organization', desc: 'Specialists in Entertainment and Multimedia Computing creativity.', gradient: 'from-purple-500 to-purple-600' },
              { icon: Rocket, title: 'IMAGES', subtitle: 'BSCS Organization', desc: 'Masters of Computer Science, advancing technology and research.', gradient: 'from-orange-500 to-orange-600' }
            ].map((org, i) => (
              <motion.div
                key={org.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${org.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <org.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{org.title}</h3>
                  <p className="text-sm font-semibold text-orange-600 mb-4">{org.subtitle}</p>
                  <p className="text-slate-600 leading-relaxed">{org.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-black text-slate-900 mb-4"
            >
              System Benefits
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Addressing the challenges of manual fee collection through digital transformation
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: CheckCircle2, title: 'Eliminates Manual Cash Handling', desc: 'Digital payments remove the hassle and risks of managing physical cash.', color: 'orange', borderColor: 'border-orange-500' },
              { icon: Clock, title: 'Reduces Waiting Times & Physical Queuing', desc: 'Process payments instantly from anywhere, eliminating long lines.', color: 'blue', borderColor: 'border-blue-500' },
              { icon: Shield, title: 'Secure & User-Friendly Payment Platform', desc: 'Bank-level security with an intuitive interface for all users.', color: 'green', borderColor: 'border-green-500' },
              { icon: FileText, title: 'Automated Record-Keeping & Financial Tracking', desc: 'Complete transaction history and financial reports at your fingertips.', color: 'purple', borderColor: 'border-purple-500' },
              { icon: Database, title: 'Real-Time Transaction Monitoring', desc: 'Track all payments as they happen with instant notifications.', color: 'cyan', borderColor: 'border-cyan-500' },
              { icon: Globe, title: 'Accessible Anytime, Anywhere', desc: 'Pay your membership dues 24/7 from any device with internet access.', color: 'pink', borderColor: 'border-pink-500' },
              { icon: Shield, title: 'Enhanced Transparency & Accountability', desc: 'Complete audit trails ensure transparent financial operations.', color: 'indigo', borderColor: 'border-indigo-500' },
              { icon: Users, title: 'Designed for BSIT, BSEMC, and BSCS Students', desc: 'Tailored specifically for Gordon College CCS student organizations.', color: 'amber', borderColor: 'border-amber-500' }
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.floor(i / 2) * 0.1 }}
                className="group"
              >
                <div className={`bg-white p-8 rounded-2xl border-l-4 ${benefit.borderColor} shadow-sm hover:shadow-xl transition-all h-full`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-${benefit.color}-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <benefit.icon className={`w-7 h-7 text-${benefit.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-2">{benefit.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Supporting Gordon College's Digital Transformation
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              This system highlights Gordon College's commitment to innovation and digital transformation. 
              By integrating technology into organizational operations, we ensure that CCS student services 
              remain future-ready, sustainable, and accessible.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              Learn More About Our Mission
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block mb-6 px-4 py-2 bg-orange-100 text-orange-700 border border-orange-200 rounded-md text-sm font-medium">
                Student Council & Organization
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-slate-900">Student Council &</span>
                <br />
                <span className="text-orange-600">Organization</span>
                <br />
                <span className="text-slate-900">Online Membership</span>
                <br />
                <span className="text-orange-600">Payment System</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
            >
              A secure, modern digital platform for BSIT, BSEMC, and BSCS students to conveniently pay membership dues online. Streamlining financial management for ELITES, IMAGES, and SPECS organizations.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 pt-6"
            >
              <Link href="/auth/signup">
                <button className="px-8 py-4 text-base font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Get Started
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-8 py-4 text-base font-bold text-orange-600 bg-white border-2 border-orange-600 hover:bg-orange-50 rounded-lg shadow-md hover:shadow-lg transition-all">
                  Login
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Organizations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider mb-4">
              OUR COMMUNITY
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">CCS Student Organizations</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Three organizations, one unified system supporting BSIT, BSEMC, and BSCS programs at Gordon College
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <div className="p-8 hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-200 bg-white rounded-xl h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">ELITES</h3>
                <p className="text-sm text-orange-600 font-medium mb-3">BSIT Student Council</p>
                <p className="text-slate-600 leading-relaxed">Leaders in Information Technology, fostering innovation and excellence.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group"
            >
              <div className="p-8 hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-200 bg-white rounded-xl h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clapperboard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">SPECS</h3>
                <p className="text-sm text-orange-600 font-medium mb-3">BSEMC Organization</p>
                <p className="text-slate-600 leading-relaxed">Specialists in Entertainment and Multimedia Computing creativity.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <div className="p-8 hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-200 bg-white rounded-xl h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">IMAGES</h3>
                <p className="text-sm text-orange-600 font-medium mb-3">BSCS Organization</p>
                <p className="text-slate-600 leading-relaxed">Masters of Computer Science, advancing technology and research.</p>
              </div>
            </motion.div>
          </div>
          <div className="text-center mt-12">
            <Link href="#benefits" className="inline-flex items-center justify-center px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:scale-105">
              WHY CHOOSE US
            </Link>
          </div>
        </div>
      </section>

      {/* System Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">System Benefits</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Addressing the challenges of manual fee collection through digital transformation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-orange-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Eliminates Manual Cash Handling</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Digital payments remove the hassle and risks of managing physical cash.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-blue-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Reduces Waiting Times & Physical Queuing</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Process payments instantly from anywhere, eliminating long lines.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-green-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Secure & User-Friendly Payment Platform</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Bank-level security with an intuitive interface for all users.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-purple-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Automated Record-Keeping & Financial Tracking</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Complete transaction history and financial reports at your fingertips.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-cyan-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="w-7 h-7 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Real-Time Transaction Monitoring</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Track all payments as they happen with instant notifications.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 6 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-pink-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-7 h-7 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Accessible Anytime, Anywhere</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Pay your membership dues 24/7 from any device with internet access.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 7 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-indigo-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Enhanced Transparency & Accountability</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Complete audit trails ensure transparent financial operations.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 8 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white p-8 rounded-2xl border-l-4 border-amber-500 shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Designed for BSIT, BSEMC, and BSCS Students</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Tailored specifically for Gordon College CCS student organizations.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supporting Digital Transformation */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Supporting Gordon College's Digital Transformation
            </h2>
            <p className="text-lg text-orange-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              This system highlights Gordon College's commitment to innovation and digital transformation. By integrating technology into organizational operations, we ensure that CCS student services remain future-ready, sustainable, and accessible.
            </p>
            <Link href="/about">
              <button className="px-8 py-4 text-base font-bold text-orange-600 bg-white hover:bg-orange-50 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                Learn More About Our Mission
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
