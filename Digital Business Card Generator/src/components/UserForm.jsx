import React from "react";
import { useCard } from "../context/CardContext";
import { ImageUploader } from "./ImageUploader";
import { FaUser, FaBriefcase, FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaAlignLeft, FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const UserForm = () => {
  const { cardData, updateField, updateSocial, errors } = useCard();

  return (
    <div className="space-y-6">
      {/* Profile Image Uploader */}
      <ImageUploader />

      <div className="border-t border-slate-150 dark:border-slate-800 pt-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-800 mb-4 flex items-center gap-2">
          <span>Personal Information</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label htmlFor="form-name" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Full Name *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450 dark:text-slate-400">
                <FaUser className="text-xs" />
              </span>
              <input
                id="form-name"
                type="text"
                value={cardData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Alex Morgan"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.name ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Job Title */}
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label htmlFor="form-job" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Job Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450 dark:text-slate-400">
                <FaBriefcase className="text-xs" />
              </span>
              <input
                id="form-job"
                type="text"
                value={cardData.jobTitle}
                onChange={(e) => updateField("jobTitle", e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label htmlFor="form-company" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Company
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450 dark:text-slate-400">
                <FaBuilding className="text-xs" />
              </span>
              <input
                id="form-company"
                type="text"
                value={cardData.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="e.g. ABC Technologies"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label htmlFor="form-email" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Email *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450 dark:text-slate-400">
                <FaEnvelope className="text-xs" />
              </span>
              <input
                id="form-email"
                type="email"
                value={cardData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="e.g. alex@example.com"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.email ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 font-medium">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label htmlFor="form-phone" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Phone *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450 dark:text-slate-400">
                <FaPhone className="text-xs" />
              </span>
              <input
                id="form-phone"
                type="tel"
                value={cardData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="e.g. +91 9876543210"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.phone ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 font-medium">{errors.phone}</p>}
          </div>

          {/* Website */}
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label htmlFor="form-web" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Website
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450 dark:text-slate-400">
                <FaGlobe className="text-xs" />
              </span>
              <input
                id="form-web"
                type="text"
                value={cardData.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="e.g. https://yourwebsite.com"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.website ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.website && <p className="text-[11px] text-rose-500 font-medium">{errors.website}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1.5 col-span-2">
            <label htmlFor="form-addr" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450 dark:text-slate-400">
                <FaMapMarkerAlt className="text-xs" />
              </span>
              <input
                id="form-addr"
                type="text"
                value={cardData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="e.g. Kanpur, Uttar Pradesh"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5 col-span-2">
            <label htmlFor="form-bio" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Short Bio
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-450 dark:text-slate-400">
                <FaAlignLeft className="text-xs" />
              </span>
              <textarea
                id="form-bio"
                value={cardData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="e.g. Passionate software developer specializing in building modern web architectures..."
                rows="3"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-150 dark:border-slate-800 pt-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          Social Links
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label htmlFor="form-linkedin" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              LinkedIn URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#0a66c2]">
                <FaLinkedin className="text-xs" />
              </span>
              <input
                id="form-linkedin"
                type="text"
                value={cardData.socials.linkedIn}
                onChange={(e) => updateSocial("linkedIn", e.target.value)}
                placeholder="e.g. https://linkedin.com/in/username"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.linkedIn ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.linkedIn && <p className="text-[11px] text-rose-500 font-medium">{errors.linkedIn}</p>}
          </div>

          {/* GitHub */}
          <div className="space-y-1.5">
            <label htmlFor="form-github" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              GitHub URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-900 dark:text-slate-200">
                <FaGithub className="text-xs" />
              </span>
              <input
                id="form-github"
                type="text"
                value={cardData.socials.gitHub}
                onChange={(e) => updateSocial("gitHub", e.target.value)}
                placeholder="e.g. https://github.com/username"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.gitHub ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.gitHub && <p className="text-[11px] text-rose-500 font-medium">{errors.gitHub}</p>}
          </div>

          {/* Instagram */}
          <div className="space-y-1.5">
            <label htmlFor="form-insta" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Instagram URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#e1306c]">
                <FaInstagram className="text-xs" />
              </span>
              <input
                id="form-insta"
                type="text"
                value={cardData.socials.instagram}
                onChange={(e) => updateSocial("instagram", e.target.value)}
                placeholder="e.g. https://instagram.com/username"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.instagram ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.instagram && <p className="text-[11px] text-rose-500 font-medium">{errors.instagram}</p>}
          </div>

          {/* Twitter / X */}
          <div className="space-y-1.5">
            <label htmlFor="form-x" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              X (Twitter) URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-900 dark:text-slate-200">
                <FaXTwitter className="text-xs" />
              </span>
              <input
                id="form-x"
                type="text"
                value={cardData.socials.twitter}
                onChange={(e) => updateSocial("twitter", e.target.value)}
                placeholder="e.g. https://x.com/username"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.twitter ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.twitter && <p className="text-[11px] text-rose-500 font-medium">{errors.twitter}</p>}
          </div>

          {/* Facebook */}
          <div className="space-y-1.5">
            <label htmlFor="form-fb" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Facebook URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1877f2]">
                <FaFacebook className="text-xs" />
              </span>
              <input
                id="form-fb"
                type="text"
                value={cardData.socials.facebook}
                onChange={(e) => updateSocial("facebook", e.target.value)}
                placeholder="e.g. https://facebook.com/username"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.facebook ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.facebook && <p className="text-[11px] text-rose-500 font-medium">{errors.facebook}</p>}
          </div>

          {/* Portfolio */}
          <div className="space-y-1.5">
            <label htmlFor="form-port" className="block text-xs font-semibold text-slate-900 dark:text-slate-800">
              Portfolio URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <FaLink className="text-xs" />
              </span>
              <input
                id="form-port"
                type="text"
                value={cardData.socials.portfolio}
                onChange={(e) => updateSocial("portfolio", e.target.value)}
                placeholder="e.g. https://yourwebsite.com/portfolio"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400 ${
                  errors.portfolio ? "border-rose-500" : "border-slate-250 dark:border-slate-800"
                }`}
              />
            </div>
            {errors.portfolio && <p className="text-[11px] text-rose-500 font-medium">{errors.portfolio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
