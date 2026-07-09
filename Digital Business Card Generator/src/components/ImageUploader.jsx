import React, { useState, useRef } from "react";
import { FaCloudUploadAlt, FaTrash, FaSync } from "react-icons/fa";
import { useCard } from "../context/CardContext";

export const ImageUploader = () => {
  const { cardData, updateField } = useCard();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setError("");
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB.");
      return;
    }

    // Validate type (JPG, PNG, WEBP)
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported format. Please upload JPG, PNG, or WEBP.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      updateField("profileImage", e.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    updateField("profileImage", "");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-500">
        Profile Image
      </label>

      {cardData.profileImage ? (
        <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <img
            src={cardData.profileImage}
            alt="Profile Preview"
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
          />
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <FaSync className="text-[10px]" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <FaTrash className="text-[10px]" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10"
              : "border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 hover:border-slate-350 dark:hover:border-slate-700"
          }`}
        >
          <FaCloudUploadAlt className="text-3xl text-emerald-500 mb-2" />
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-500">
            Drag & drop profile picture
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-700 mt-1">
            Accepts JPG, PNG, WEBP (Max 2MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-[11px] font-medium text-rose-500 mt-1">{error}</p>
      )}
    </div>
  );
};
