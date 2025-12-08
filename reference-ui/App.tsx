import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Laptop, Clapperboard, Rocket, CheckCircle2, Clock, Shield, Database, Globe, Users } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white">C</span>
            </div>
            <span className="text-xl text-gray-900">CCS MemberLink</span>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">Register</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
              Student Council & Organization
            </Badge>
            <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">
              <span className="text-orange-600">Student Council &</span>
              <br />
              <span className="text-orange-600">Organization</span>
              <br />
              Online Membership
              <br />
              <span className="text-orange-600">Payment System</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            A secure, modern digital platform for BSIT, BSEMC, and BSCS students to conveniently pay membership dues online. Streamlining financial management for ELITES, IMAGES, and SPECS organizations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8">
              Login
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Community Badge */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2">
            OUR COMMUNITY
          </Badge>
        </div>
      </section>

      {/* Organizations Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-gray-900">CCS Student Organizations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three organizations, one unified system supporting BSIT, BSEMC, and BSCS programs at Gordon College
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Laptop className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-3 text-gray-900">ELITES</h3>
                <p className="text-gray-600">
                  BSIT Student Council - Leaders in Information Technology, fostering innovation and excellence.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Clapperboard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-3 text-gray-900">SPECS</h3>
                <p className="text-gray-600">
                  BSEMC Organization - Specialists in Entertainment and Multimedia Computing creativity.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 bg-white">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-3 text-gray-900">IMAGES</h3>
                <p className="text-gray-600">
                  BSCS Organization - Masters of Computer Science, advancing technology and research.
                </p>
              </Card>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              WHY CHOOSE US
            </Button>
          </div>
        </div>
      </section>

      {/* System Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-gray-900">System Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Addressing the challenges of manual fee collection through digital transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Eliminates Manual Cash Handling</h3>
                    <p className="text-gray-600">Digital payments remove the hassle and risks of managing physical cash.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Reduces Waiting Times & Physical Queuing</h3>
                    <p className="text-gray-600">Process payments instantly from anywhere, eliminating long lines.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Secure & User-Friendly Payment Platform</h3>
                    <p className="text-gray-600">Bank-level security with an intuitive interface for all users.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Automated Record-Keeping & Financial Tracking</h3>
                    <p className="text-gray-600">Complete transaction history and financial reports at your fingertips.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Real-Time Transaction Monitoring</h3>
                    <p className="text-gray-600">Track all payments as they happen with instant notifications.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Accessible Anytime, Anywhere</h3>
                    <p className="text-gray-600">Pay your membership dues 24/7 from any device with internet access.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Enhanced Transparency & Accountability</h3>
                    <p className="text-gray-600">Complete audit trails ensure transparent financial operations.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 bg-white border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-gray-900">Designed for BSIT, BSEMC, and BSCS Students</h3>
                    <p className="text-gray-600">Tailored specifically for Gordon College CCS student organizations.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl mb-6 text-white">
                Supporting Gordon College&apos;s Digital Transformation
              </h2>
              <p className="text-xl text-orange-100 mb-4">
                This system highlights Gordon College&apos;s commitment to innovation and digital transformation. By integrating technology into organizational operations, we ensure that CCS student services remain future-ready, sustainable, and accessible.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-orange-50 mt-6"
              >
                Learn More About Our Mission
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 mb-2">© 2025 CCS MemberLink. All rights reserved.</p>
            <p className="text-sm text-gray-500">Supporting Gordon College&apos;s Digital Transformation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
