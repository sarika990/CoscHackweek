import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Camera, Calendar, ShieldCheck, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    setValue,
    formState: { errors: infoErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch('newPassword', '');

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      if (user.profileImage) {
        setProfileImagePreview(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/${user.profileImage}`);
      }
    }
  }, [user, setValue]);

  // Handle avatar image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit profile details & image
  const onInfoSubmit = async (data) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      const response = await API.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateProfile(response.data);
      toast.success('Profile updated successfully!');
      setProfileImageFile(null);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile info';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  // Submit password change
  const onPasswordSubmit = async (data) => {
    try {
      setChangingPassword(true);
      await API.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const formattedJoinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Update your profile configurations, avatars, and passwords.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left panel: Avatar Preview card */}
          <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center h-fit space-y-5">
            <div className="relative">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt={user?.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-primary-500 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold text-3xl border-2 border-primary-500">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Camera Upload Button Overlay */}
              <label className="absolute bottom-0 right-0 p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full cursor-pointer transition-colors shadow shadow-slate-950/40">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{user?.email}</p>
            </div>

            <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Joined: {formattedJoinedDate || 'Recently'}</span>
            </div>
          </div>

          {/* Right panel: Details & Password forms */}
          <div className="md:col-span-2 space-y-6">
            {/* Info form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-2 text-slate-850 dark:text-white font-bold border-b border-slate-100 dark:border-slate-800 pb-4">
                <User className="w-5 h-5 text-primary-500" />
                <span>Profile Details</span>
              </div>

              <form onSubmit={handleInfoSubmit(onInfoSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...registerInfo('name', { required: 'Name is required' })}
                      className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${infoErrors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    />
                    {infoErrors.name && (
                      <p className="text-rose-500 text-xs mt-1">{infoErrors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...registerInfo('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${infoErrors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    />
                    {infoErrors.email && (
                      <p className="text-rose-500 text-xs mt-1">{infoErrors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10 hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {uploading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Password form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-2 text-slate-850 dark:text-white font-bold border-b border-slate-100 dark:border-slate-800 pb-4">
                <KeyRound className="w-5 h-5 text-primary-500" />
                <span>Change Password</span>
              </div>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${passwordErrors.currentPassword ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-rose-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password & confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: { value: 6, message: 'Must be at least 6 characters' },
                        })}
                        className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${passwordErrors.newPassword ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-rose-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerPassword('confirmNewPassword', {
                          required: 'Confirm new password is required',
                          validate: (value) => value === newPassword || 'Passwords do not match',
                        })}
                        className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${passwordErrors.confirmNewPassword ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
                      />
                      {passwordErrors.confirmNewPassword && (
                        <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmNewPassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10 hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {changingPassword && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
