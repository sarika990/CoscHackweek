import React from "react";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

export const GradientTemplate = ({ data, accentColor, selectedFont, cardStyle, copyField }) => {
  const isRounded = cardStyle === "rounded";

  // Create standard gradient endpoints using accentColor
  // We can programmatically mix or generate a secondary color or fade to dark/light
  const gradientStyle = {
    background: `linear-gradient(135deg, ${accentColor} 0%, #1e293b 100%)`
  };

  return (
    <div 
      className={`w-full max-w-md text-white shadow-2xl overflow-hidden transition-all duration-300 ${
        isRounded ? "rounded-2xl" : "rounded-none"
      } font-${selectedFont}`}
      style={gradientStyle}
    >
      <div className="p-6 md:p-8 bg-slate-950/20 backdrop-brightness-75 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h2 className="text-2xl font-extrabold tracking-tight truncate">{data.name || "Your Name"}</h2>
              <p className="text-sm font-medium opacity-90 mt-1 truncate">{data.jobTitle || "Job Title"}</p>
              <p className="text-xs opacity-75 truncate">{data.company || "Company Name"}</p>
            </div>

            {/* Profile Image */}
            <div className="shrink-0">
              {data.profileImage ? (
                <img 
                  src={data.profileImage} 
                  alt={data.name} 
                  className={`w-16 h-16 object-cover border-2 border-white/80 shadow-md ${
                    isRounded ? "rounded-full" : "rounded-none"
                  }`}
                />
              ) : (
                <div 
                  className={`w-16 h-16 flex items-center justify-center bg-white/20 text-white text-xl font-bold border border-white/20 shadow-inner ${
                    isRounded ? "rounded-full" : "rounded-none"
                  }`}
                >
                  {data.name ? data.name.charAt(0) : "U"}
                </div>
              )}
            </div>
          </div>

          {data.bio && (
            <p className="text-sm text-slate-200 leading-relaxed mb-6 font-light">
              {data.bio}
            </p>
          )}
        </div>

        {/* Contact links block */}
        <div className="space-y-3 border-t border-white/10 pt-5 text-sm">
          {data.phone && (
            <div 
              onClick={() => copyField("phone", data.phone)} 
              className="flex items-center gap-3 cursor-pointer hover:text-emerald-350 transition-colors group"
            >
              <FaPhone className="opacity-80 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">{data.phone}</span>
            </div>
          )}

          {data.email && (
            <div 
              onClick={() => copyField("email", data.email)} 
              className="flex items-center gap-3 cursor-pointer hover:text-emerald-350 transition-colors group"
            >
              <FaEnvelope className="opacity-80 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">{data.email}</span>
            </div>
          )}

          {data.website && (
            <div 
              onClick={() => copyField("website", data.website)} 
              className="flex items-center gap-3 cursor-pointer hover:text-emerald-350 transition-colors group"
            >
              <FaGlobe className="opacity-80 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">{data.website}</span>
            </div>
          )}

          {data.address && (
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="opacity-80 shrink-0" />
              <span className="text-xs opacity-90 line-clamp-1">{data.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
