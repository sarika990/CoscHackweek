import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../services/api';

const ImageUpload = ({ existingImages = [], onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sanitizeFilename = (filename) => {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) return filename;
    let stem = filename.substring(0, lastDot);
    const ext = filename.substring(lastDot).toLowerCase();
    stem = stem.replace(/[^a-zA-Z0-9_\-\s]/g, '');
    stem = stem.replace(/\s+/g, ' ').trim();
    let sanitized = stem.slice(0, 100) + ext;
    if (!stem) {
      sanitized = `image_${Math.random().toString(36).substring(2, 10)}${ext}`;
    }
    return sanitized;
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((file) => {
        const errors = file.errors.map(e => e.message).join(', ');
        toast.error(`${file.file.name}: ${errors}`);
      });
    }

    if (acceptedFiles.length === 0) return;

    if (acceptedFiles.length > 100) {
      toast.error("You can upload a maximum of 100 images at once.");
      return;
    }

    // Filter out invalid/duplicate files
    const validFiles = [];
    const existingNames = new Set(existingImages.map(img => img.filename.toLowerCase()));
    const batchNames = new Set();

    for (const file of acceptedFiles) {
      if (file.size === 0) {
        toast.error(`Rejected ${file.name}: File is empty.`);
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Rejected ${file.name}: Exceeds 10MB limit.`);
        continue;
      }

      const sanitizedName = sanitizeFilename(file.name);
      if (existingNames.has(sanitizedName.toLowerCase())) {
        toast.error(`Rejected ${file.name}: Filename already exists in workspace.`);
        continue;
      }

      if (batchNames.has(sanitizedName.toLowerCase())) {
        toast.error(`Rejected ${file.name}: Duplicate filename in upload batch.`);
        continue;
      }

      batchNames.add(sanitizedName.toLowerCase());
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    let completed = 0;
    const total = validFiles.length;

    for (const file of validFiles) {
      try {
        await uploadImage(file, (e) => {
          // Individual progress isn't as informative for batches, so calculate aggregate completion
        });
        completed++;
        setProgress(Math.round((completed / total) * 100));
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err.response?.data?.detail || err.message}`);
      }
    }

    setUploading(false);
    setProgress(0);
    if (completed > 0) {
      toast.success(`Successfully processed ${completed} images!`);
      if (onUploadSuccess) onUploadSuccess();
    }
  }, [existingImages, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/5'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/20'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              {isDragActive ? "Drop the images here..." : "Drag & drop images here, or click to browse"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP up to 10MB each (max 100 images)
            </p>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="mt-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xs">
          <div className="flex justify-between items-center text-sm font-medium mb-2 text-indigo-600 dark:text-indigo-400">
            <span>Processing batch...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
