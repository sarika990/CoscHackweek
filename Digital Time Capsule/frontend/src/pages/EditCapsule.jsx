import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CapsuleForm from '../components/CapsuleForm';
import Loader from '../components/Loader';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit3, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const EditCapsule = () => {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await API.get(`/capsules/${id}`);
        // If capsule is already unlocked, redirect to details page with warning
        if (!data.locked) {
          toast.error('Unlocked capsules cannot be modified');
          return navigate(`/capsule/${id}`);
        }
        setCapsule(data);
      } catch (error) {
        toast.error('Failed to load capsule details');
        navigate('/dashboard');
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleFormSubmit = async (formData) => {
    try {
      setUpdating(true);
      await API.put(`/capsules/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Time capsule updated successfully');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update time capsule';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loadingDetails ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-10 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Edit Locked Capsule
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Update title, secret message, attachment files, or unlock dates before the clock runs out.
                </p>
              </div>
            </div>

            <CapsuleForm
              initialData={capsule}
              onSubmit={handleFormSubmit}
              submitLabel="Save Changes"
              loading={updating}
            />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditCapsule;
