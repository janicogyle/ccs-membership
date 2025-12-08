'use client';

import { useState } from 'react';
import { PageTemplate } from '@/components/templates';
import { HeroSection } from '@/components/organisms';
import { Card } from '@/components/molecules';
import { Button, Input, Label } from '@/components/atoms';
import { MESSAGES } from '@/constants';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Save ticket to Firestore
      await addDoc(collection(db, 'tickets'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'pending',
        createdAt: new Date(),
      });
      
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(MESSAGES.GENERIC_ERROR);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate>
      <HeroSection
        title="Contact Us"
        subtitle="Have questions? Reach out to ELITES, SPECS, or IMAGES."
        showLogo={false}
      />

      <div className="flex justify-center">
        <div className="max-w-6xl px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 mb-24">
            <Card
              title="Email"
              description="ccs.payment@gordon.edu.ph"
              className="text-center"
            />
          <Card
            title="College"
            description="College of Computer Study - Gordon College"
            className="text-center"
          />
          <Card
            title="Organizations"
            description="ELITES (BSIT) • IMAGES (BSEMC) • SPECS (BSCS)"
            className="text-center"
          />
        </div>

        <div className="flex justify-center">
          <div className="max-w-3xl w-full">
            <div className="bg-white rounded-3xl p-10 md:p-16 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Send us a Message</h2>
              <p className="text-lg text-slate-600">We'd love to hear from you. Fill out the form below.</p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" required className="text-center">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="text-center"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" required className="text-center">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@example.com"
                      className="text-center"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-center">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09XX XXX XXXX"
                    className="text-center"
                  />
                </div>

                <div>
                  <Label htmlFor="message" required className="text-center">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors resize-none text-center"
                    placeholder="Write your message here..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg font-semibold"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
    </PageTemplate>
  );
}
