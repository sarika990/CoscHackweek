import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CapsuleForm from '../components/CapsuleForm';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Hourglass } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateCapsule = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      await API.post('/capsules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Memory capsule sealed successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create time capsule';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-10 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400">
              <Hourglass className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Seal a Time Capsule
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Lock away letters, photos, and media. They will remain completely encrypted and hidden until your chosen unlock date.
              </p>
            </div>
          </div>

          <CapsuleForm onSubmit={handleFormSubmit} loading={loading} />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCapsule;
