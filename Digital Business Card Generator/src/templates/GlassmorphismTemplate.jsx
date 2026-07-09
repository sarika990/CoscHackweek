import React from "react";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

export const GlassmorphismTemplate = ({ data, accentColor, selectedFont, cardStyle, copyField }) => {
  const isRounded = cardStyle === "rounded";

  return (
    <div 
      className={`relative w-full max-w-md overflow-hidden p-6 md:p-8 transition-all duration-300 font-${selectedFont} ${
        isRounded ? "rounded-3xl" : "rounded-none"
      } border border-white/10`}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
      }}
    >
      {/* Decorative Glow Blobs inside the card boundary for standalone viewing */}
      <div 
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      ></div>
      <div 
        className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full blur-2xl opacity-45 pointer-events-none"
        style={{ backgroundColor: "#3b82f6" }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          {/* Profile Image / Initials */}
          <div className="shrink-0">
            {data.profileImage ? (
              <img 
                src={data.profileImage} 
                alt={data.name} 
                className={`w-20 h-20 object-cover border border-white/20 shadow-md ${
                  isRounded ? "rounded-full" : "rounded-none"
                }`}
              />
            ) : (
              <div 
                className={`w-20 h-20 flex items-center justify-center text-white text-2xl font-bold shadow-inner ${
                  isRounded ? "rounded-full" : "rounded-none"
                }`}
                style={{ backgroundColor: accentColor }}
              >
                {data.name ? data.name.charAt(0) : "U"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white tracking-tight truncate">{data.name || "Your Name"}</h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1 truncate">
              {data.jobTitle || "Job Title"}
            </p>
            <p className="text-xs text-slate-400 truncate">{data.company || "Company Name"}</p>
          </div>
        </div>

        {data.bio && (
          <p className="text-xs text-slate-350 leading-relaxed mb-6 font-light">
            {data.bio}
          </p>
        )}

        <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
          {data.phone && (
            <div 
              onClick={() => copyField("phone", data.phone)} 
              className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 group"
            >
              <FaPhone style={{ color: accentColor }} className="shrink-0 group-hover:scale-115 transition-transform" />
              <span className="text-slate-300 truncate">{data.phone}</span>
            </div>
          )}

          {data.email && (
            <div 
              onClick={() => copyField("email", data.email)} 
              className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 group"
            >
              <FaEnvelope style={{ color: accentColor }} className="shrink-0 group-hover:scale-115 transition-transform" />
              <span className="text-slate-300 truncate">{data.email}</span>
            </div>
          )}

          {data.website && (
            <div 
              onClick={() => copyField("website", data.website)} 
              className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 group"
            >
              <FaGlobe style={{ color: accentColor }} className="shrink-0 group-hover:scale-115 transition-transform" />
              <span className="text-slate-300 truncate">{data.website}</span>
            </div>
          )}

          {data.address && (
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
              <FaMapMarkerAlt style={{ color: accentColor }} className="shrink-0" />
              <span className="text-slate-300 line-clamp-1">{data.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
