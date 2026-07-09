import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Upload, X, Film, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = ['Birthday', 'Goals', 'Family', 'Travel', 'Education', 'Career', 'Personal'];

const CapsuleForm = ({ initialData, onSubmit, submitLabel = 'Secure Capsule', loading }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      message: initialData?.message || '',
      category: initialData?.category || 'Personal',
      unlockDate: initialData?.unlockDate
        ? new Date(initialData.unlockDate).toISOString().substring(0, 16)
        : '',
      visibility: initialData?.visibility || 'private',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
    },
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  // File Preview States
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState('');
  const [pdfPreviewName, setPdfPreviewName] = useState('');

  // Flag if keeping existing files (in Edit mode)
  const [keepExistingFiles, setKeepExistingFiles] = useState(true);

  // Setup initial previews if in Edit Mode
  useEffect(() => {
    if (initialData) {
      if (initialData.images && initialData.images.length > 0) {
        setImagePreviews(initialData.images.map(img => `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/${img}`));
      }
      if (initialData.video) {
        setVideoPreview(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/${initialData.video}`);
      }
      if (initialData.pdf) {
        setPdfPreviewName(initialData.pdf.split('/').pop());
      }
    }
  }, [initialData]);

  // Handle image selections
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setKeepExistingFiles(false); // Overwrite if they select new ones

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle video selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setKeepExistingFiles(false);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Handle PDF selection
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setKeepExistingFiles(false);
      setPdfPreviewName(file.name);
    }
  };

  const clearImagePreviews = () => {
    setImageFiles([]);
    setImagePreviews([]);
    setKeepExistingFiles(false);
  };

  const clearVideoPreview = () => {
    setVideoFile(null);
    setVideoPreview('');
    setKeepExistingFiles(false);
  };

  const clearPdfPreview = () => {
    setPdfFile(null);
    setPdfPreviewName('');
    setKeepExistingFiles(false);
  };

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('message', data.message);
    formData.append('category', data.category);
    formData.append('unlockDate', data.unlockDate);
    formData.append('visibility', data.visibility);
    formData.append('tags', data.tags);
    formData.append('keepExistingFiles', keepExistingFiles);

    // Append file attachments
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }

    onSubmit(formData);
  };

  // Get current date & time string for min unlock date restriction (must be future)
  const getMinDateTime = () => {
    const now = new Date();
    // Offset local timezone
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 1); // add 1 minute buffer
    return now.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: General Fields */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Capsule Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Letter to My 30-Year-Old Self"
              {...register('title', { required: 'Title is required' })}
              className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
            />
            {errors.title && (
              <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="A brief summary of what's inside..."
              {...register('description')}
              className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none"
            />
          </div>

          {/* Locked Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Secret Message * (Only viewable after unlock date)
            </label>
            <textarea
              rows={5}
              placeholder="Write your secret words, promises, goals, or dreams..."
              {...register('message', { required: 'Secret message is required' })}
              className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${errors.message ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
            />
            {errors.message && (
              <p className="text-rose-500 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Category & Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Visibility
              </label>
              <div className="flex bg-slate-50 dark:bg-slate-800/40 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                <label className="flex-1 text-center py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all has-[:checked]:bg-primary-600 has-[:checked]:text-white">
                  <input
                    type="radio"
                    value="private"
                    {...register('visibility')}
                    className="sr-only"
                  />
                  Private
                </label>
                <label className="flex-1 text-center py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all has-[:checked]:bg-primary-600 has-[:checked]:text-white">
                  <input
                    type="radio"
                    value="public"
                    {...register('visibility')}
                    className="sr-only"
                  />
                  Public
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Lock Date & Uploads */}
        <div className="space-y-6">
          {/* Unlock Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Unlock Date & Time * (Capsule remains locked until this date)
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="datetime-local"
                min={getMinDateTime()}
                {...register('unlockDate', { required: 'Unlock date is required' })}
                className={`w-full bg-slate-50 dark:bg-slate-800/40 border ${errors.unlockDate ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors`}
              />
            </div>
            {errors.unlockDate && (
              <p className="text-rose-500 text-xs mt-1">{errors.unlockDate.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g., memories, graduation, travel"
              {...register('tags')}
              className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            />
          </div>

          {/* Upload Attachments Section */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 space-y-4 bg-slate-50/30 dark:bg-slate-900/10 backdrop-blur-sm">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span>Attach Memories</span>
            </h4>

            {/* Images Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Photos (max 5)</span>
                {imagePreviews.length > 0 && (
                  <button type="button" onClick={clearImagePreviews} className="text-rose-500 hover:text-rose-600 text-xs font-semibold">
                    Clear
                  </button>
                )}
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 rounded-2xl py-4 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500">Upload Images (JPG, PNG, WEBP)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {imagePreviews.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="preview"
                      className="w-12 h-12 object-cover rounded-xl border border-slate-100 dark:border-slate-800"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Video (max 1)</span>
                {videoPreview && (
                  <button type="button" onClick={clearVideoPreview} className="text-rose-500 hover:text-rose-600 text-xs font-semibold">
                    Remove
                  </button>
                )}
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 rounded-2xl py-4 cursor-pointer transition-colors">
                <Film className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500">Upload Video (MP4)</span>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
              {videoPreview && (
                <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2">
                  <Film className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate flex-1">Video attached</span>
                </div>
              )}
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">PDF Document (max 1)</span>
                {pdfPreviewName && (
                  <button type="button" onClick={clearPdfPreview} className="text-rose-500 hover:text-rose-600 text-xs font-semibold">
                    Remove
                  </button>
                )}
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 rounded-2xl py-4 cursor-pointer transition-colors">
                <FileText className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500">Upload PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
              </label>
              {pdfPreviewName && (
                <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate flex-1">{pdfPreviewName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default CapsuleForm;
