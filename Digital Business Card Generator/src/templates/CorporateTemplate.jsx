import React from "react";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaBuilding, FaBriefcase } from "react-icons/fa";

export const CorporateTemplate = ({ data, accentColor, selectedFont, cardStyle, copyField }) => {
  const isRounded = cardStyle === "rounded";

  return (
    <div 
      className={`w-full max-w-md bg-slate-900 text-slate-100 shadow-2xl overflow-hidden border border-slate-800 transition-all duration-300 ${
        isRounded ? "rounded-2xl" : "rounded-none"
      } font-${selectedFont}`}
    >
      {/* Accent colored top banner block */}
      <div className="h-4 w-full" style={{ backgroundColor: accentColor }}></div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          {/* Profile Image / Initials */}
          <div className="relative mb-4 shrink-0">
            {data.profileImage ? (
              <img 
                src={data.profileImage} 
                alt={data.name} 
                className={`w-28 h-28 object-cover border-4 shadow-md ${
                  isRounded ? "rounded-full" : "rounded-none"
                }`}
                style={{ borderColor: accentColor }}
              />
            ) : (
              <div 
                className={`w-28 h-28 flex items-center justify-center text-white text-4xl font-bold shadow-inner ${
                  isRounded ? "rounded-full" : "rounded-none"
                }`}
                style={{ backgroundColor: accentColor }}
              >
                {data.name ? data.name.charAt(0) : "U"}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-wide truncate max-w-full">{data.name || "Your Name"}</h2>
          <p className="text-sm font-semibold tracking-wider uppercase mt-1" style={{ color: accentColor }}>
            {data.jobTitle || "Job Title"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{data.company || "Company Name"}</p>
        </div>

        {data.bio && (
          <div className="mb-6 text-center text-slate-300 text-sm italic leading-relaxed border-t border-b border-slate-800 py-3">
            "{data.bio}"
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {data.phone && (
            <div 
              onClick={() => copyField("phone", data.phone)} 
              className="flex items-center gap-2.5 p-2 rounded bg-slate-950/60 hover:bg-slate-850 cursor-pointer border border-slate-800/80 transition-all group"
            >
              <FaPhone style={{ color: accentColor }} className="shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate text-slate-300 text-xs">{data.phone}</span>
            </div>
          )}

          {data.email && (
            <div 
              onClick={() => copyField("email", data.email)} 
              className="flex items-center gap-2.5 p-2 rounded bg-slate-950/60 hover:bg-slate-850 cursor-pointer border border-slate-800/80 transition-all group"
            >
              <FaEnvelope style={{ color: accentColor }} className="shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate text-slate-300 text-xs">{data.email}</span>
            </div>
          )}

          {data.website && (
            <div 
              onClick={() => copyField("website", data.website)} 
              className="flex items-center gap-2.5 p-2 rounded bg-slate-950/60 hover:bg-slate-850 cursor-pointer border border-slate-800/80 transition-all group"
            >
              <FaGlobe style={{ color: accentColor }} className="shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate text-slate-300 text-xs">{data.website}</span>
            </div>
          )}

          {data.address && (
            <div className="flex items-center gap-2.5 p-2 rounded bg-slate-950/60 border border-slate-800/80 sm:col-span-2">
              <FaMapMarkerAlt style={{ color: accentColor }} className="shrink-0" />
              <span className="text-slate-300 text-xs line-clamp-1">{data.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
