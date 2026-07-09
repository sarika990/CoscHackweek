import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, Calendar, Eye, Shield, Award, HelpCircle, ArrowRight, Compass, Flame, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Lock,
    title: 'Absolute Lock Guarantee',
    description: 'Our system locks your messages and files with strict server validation. No one can open them before the lock date.',
  },
  {
    icon: Calendar,
    title: 'Precision Scheduling',
    description: 'Set your capsule to unlock down to the exact second. Great for birthdays, goals, graduations, or anniversary wishes.',
  },
  {
    icon: Shield,
    title: 'Secure Media Attachments',
    description: 'Upload high-resolution images, videos, or PDFs. Your assets are safely stored and isolated until release.',
  },
  {
    icon: Compass,
    title: 'Visibility Control',
    description: 'Keep your memories private to yourself or share them publicly to our curated feed for the community to browse.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Compose & Create',
    description: 'Write letters, upload images, documents, or video files. Give it a name and tag it to keep things organized.',
  },
  {
    step: '02',
    title: 'Set the Lock Date',
    description: 'Choose a date and time in the future. The capsule is instantly locked away, with a live countdown timer ticking down.',
  },
  {
    step: '03',
    title: 'Unlock & Rejoice',
    description: 'When the timer hits zero, the capsule automatically opens. View your content, download documents, and celebrate.',
  },
];

const faqs = [
  {
    q: 'Can I unlock my capsule early?',
    a: 'No. The core principle of a time capsule is time-preservation. Once locked, the content cannot be read or retrieved by anyone, not even you, until the specified date.',
  },
  {
    q: 'What types of files can I upload?',
    a: 'You can upload high-quality images (JPEG, PNG, WEBP), PDF documents, and MP4 videos. We enforce file limits to ensure optimal server health.',
  },
  {
    q: 'Are public capsules viewable before unlocking?',
    a: 'No. Public capsules show up on the public feed page only AFTER they unlock. Prior to that, they remain completely hidden.',
  },
  {
    q: 'Can I edit my capsule details?',
    a: 'You can edit the title, description, message, unlock date, and files of a capsule while it is still locked. Once it is unlocked, all editing functions are locked forever to preserve history.',
  },
];

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex-grow space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/30 text-primary-600 dark:text-primary-400">
              <Flame className="w-3.5 h-3.5 fill-primary-600 dark:fill-primary-400" />
              <span>Your Personal Digital Legacy</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Lock Memories. <br />
              <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Unlock the Future.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Write letters, upload images, documents, and videos to yourself or friends. Lock them away safely until your chosen future date. Time-travel made simple.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Create Time Capsule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/public"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Public Feed</span>
              </Link>
            </div>
          </motion.div>

          {/* Hero visual mock mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-16 relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/60 shadow-2xl"
          >
            <div className="bg-slate-100 dark:bg-slate-900 p-4 flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800">
              <div className="w-3.5 h-3.5 bg-rose-500 rounded-full" />
              <div className="w-3.5 h-3.5 bg-amber-500 rounded-full" />
              <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full" />
              <span className="text-xs text-slate-400 font-mono ml-4">https://chronoscapsule.com/dashboard</span>
            </div>
            <div className="bg-white dark:bg-slate-950 p-6 sm:p-12 text-left">
              <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-semibold">Travel</span>
                  <span className="text-xs text-slate-400 font-bold uppercase">Private</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Our Roadtrip Memories</h3>
                <p className="text-slate-400 text-xs mb-4">Photos from our 2026 epic roadtrip across the coast.</p>
                <div className="grid grid-cols-4 gap-2 text-center my-4">
                  {[
                    { l: 'Days', v: '24' },
                    { l: 'Hours', v: '18' },
                    { l: 'Mins', v: '03' },
                    { l: 'Secs', v: '59' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-2 rounded-xl">
                      <span className="text-lg font-bold block">{item.v}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.l}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-150 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-xs text-rose-500 font-semibold">
                  <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Content Encrypted</span>
                  <span className="text-slate-400">Unlocks: Aug 12, 2026</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Designed to Secure Your Legacy
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            We provide core primitives designed for longevity, security, and delightful memory preservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/60 hover:shadow-xl transition-all"
              >
                <div className="p-3 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-2xl w-fit mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How ChronosCapsule Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Three simple phases to send memories forward in time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="relative bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 text-center">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent bg-slate-50 dark:bg-slate-950 px-4">
                {st.step}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
                {st.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              "I locked away memories from our college graduation. Reading the messages and looking at photos 5 years later was an emotional, unforgettable experience."
            </h2>
            <div className="flex justify-center items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix"
                alt="Sarah"
                className="w-10 h-10 rounded-full border-2 border-primary-500"
              />
              <div className="text-left">
                <div className="font-bold text-white text-sm">Sarah Jenkins</div>
                <div className="text-xs text-slate-400">Class of 2021</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-5 h-5 text-primary-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl shadow-primary-500/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-6 relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Lock Your First Capsule?</h2>
            <p className="text-primary-100 text-sm leading-relaxed">
              Create an account now, secure your digital memories today, and choose when to unlock them in the future.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 hover:bg-slate-50 font-bold rounded-2xl shadow-lg transition-all"
              >
                <span>Get Started For Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
