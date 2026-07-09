import React from "react";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

export const MinimalTemplate = ({ data, accentColor, selectedFont, cardStyle, copyField }) => {
  const isRounded = cardStyle === "rounded";

  return (
    <div 
      className={`w-full max-w-md bg-slate-50 text-slate-700 shadow-lg overflow-hidden border border-slate-200/60 p-6 md:p-8 transition-all duration-300 ${
        isRounded ? "rounded-3xl" : "rounded-none"
      } font-${selectedFont}`}
    >
      <div className="flex flex-col items-center">
        {/* Profile Image / Initials */}
        <div className="shrink-0 mb-4">
          {data.profileImage ? (
            <img 
              src={data.profileImage} 
              alt={data.name} 
              className={`w-20 h-20 object-cover grayscale hover:grayscale-0 transition-all duration-300 ${
                isRounded ? "rounded-full" : "rounded-none"
              }`}
            />
          ) : (
            <div 
              className={`w-20 h-20 flex items-center justify-center text-white text-2xl font-light shadow-inner ${
                isRounded ? "rounded-full" : "rounded-none"
              }`}
              style={{ backgroundColor: accentColor }}
            >
              {data.name ? data.name.charAt(0) : "U"}
            </div>
          )}
        </div>

        {/* Identity */}
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{data.name || "Your Name"}</h2>
        <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-medium">{data.jobTitle || "Job Title"}</p>
        <p className="text-xs text-slate-500">{data.company || "Company Name"}</p>

        {data.bio && (
          <p className="mt-4 text-center text-xs text-slate-500 leading-relaxed max-w-xs font-light">
            {data.bio}
          </p>
        )}

        {/* Separator line with custom accent color */}
        <div className="w-12 h-0.5 my-5" style={{ backgroundColor: accentColor }}></div>

        {/* Contact links */}
        <div className="w-full space-y-2.5 text-xs text-slate-600 max-w-xs">
          {data.phone && (
            <div 
              onClick={() => copyField("phone", data.phone)} 
              className="flex justify-between items-center py-1 hover:text-slate-900 cursor-pointer group"
            >
              <span className="font-medium text-slate-400">Phone</span>
              <span className="truncate max-w-[200px] border-b border-transparent group-hover:border-slate-300 transition-all">
                {data.phone}
              </span>
            </div>
          )}

          {data.email && (
            <div 
              onClick={() => copyField("email", data.email)} 
              className="flex justify-between items-center py-1 hover:text-slate-900 cursor-pointer group"
            >
              <span className="font-medium text-slate-400">Email</span>
              <span className="truncate max-w-[200px] border-b border-transparent group-hover:border-slate-300 transition-all">
                {data.email}
              </span>
            </div>
          )}

          {data.website && (
            <div 
              onClick={() => copyField("website", data.website)} 
              className="flex justify-between items-center py-1 hover:text-slate-900 cursor-pointer group"
            >
              <span className="font-medium text-slate-400">Web</span>
              <span className="truncate max-w-[200px] border-b border-transparent group-hover:border-slate-300 transition-all">
                {data.website.replace(/^https?:\/\//, "")}
              </span>
            </div>
          )}

          {data.address && (
            <div className="flex justify-between items-start py-1">
              <span className="font-medium text-slate-400 shrink-0">Loc</span>
              <span className="text-right text-[11px] text-slate-500 max-w-[200px] line-clamp-2">
                {data.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
