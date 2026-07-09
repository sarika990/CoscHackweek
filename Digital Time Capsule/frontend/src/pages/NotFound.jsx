import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Hourglass, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-6"
        >
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto border border-primary-100 dark:border-primary-900/30">
            <Hourglass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white">404</h1>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Lost in the Timeline</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              The page you are looking for does not exist or has been lost to a different time period.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all text-sm inline-block"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
