import React from "react";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaBuilding, FaBriefcase } from "react-icons/fa";

export const ModernTemplate = ({ data, accentColor, selectedFont, cardStyle, copyField }) => {
  const isRounded = cardStyle === "rounded";
  
  return (
    <div 
      className={`w-full max-w-md bg-white text-slate-800 shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 ${
        isRounded ? "rounded-2xl" : "rounded-none"
      } font-${selectedFont}`}
      style={{ borderTop: `6px solid ${accentColor}` }}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 mb-6">
          {/* Profile Image / Initials */}
          <div className="relative shrink-0">
            {data.profileImage ? (
              <img 
                src={data.profileImage} 
                alt={data.name} 
                className={`w-24 h-24 object-cover border-2 shadow-sm ${
                  isRounded ? "rounded-full" : "rounded-none"
                }`}
                style={{ borderColor: accentColor }}
              />
            ) : (
              <div 
                className={`w-24 h-24 flex items-center justify-center text-white text-3xl font-bold shadow-inner ${
                  isRounded ? "rounded-full" : "rounded-none"
                }`}
                style={{ backgroundColor: accentColor }}
              >
                {data.name ? data.name.charAt(0) : "U"}
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-slate-900 truncate">{data.name || "Your Name"}</h2>
            
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5 text-slate-600 text-sm">
              <FaBriefcase style={{ color: accentColor }} className="shrink-0" />
              <span className="truncate">{data.jobTitle || "Job Title"}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-slate-500 text-sm">
              <FaBuilding style={{ color: accentColor }} className="shrink-0" />
              <span className="truncate">{data.company || "Company Name"}</span>
            </div>
          </div>
        </div>

        {data.bio && (
          <div className="mb-6 text-slate-600 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: accentColor }}>
            {data.bio}
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
          {data.phone && (
            <div 
              onClick={() => copyField("phone", data.phone)} 
              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="p-2 rounded-md bg-slate-100 group-hover:bg-white transition-colors">
                <FaPhone style={{ color: accentColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium">Mobile</p>
                <p className="text-slate-700 truncate">{data.phone}</p>
              </div>
            </div>
          )}

          {data.email && (
            <div 
              onClick={() => copyField("email", data.email)} 
              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="p-2 rounded-md bg-slate-100 group-hover:bg-white transition-colors">
                <FaEnvelope style={{ color: accentColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium">Email</p>
                <p className="text-slate-700 truncate">{data.email}</p>
              </div>
            </div>
          )}

          {data.website && (
            <div 
              onClick={() => copyField("website", data.website)} 
              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="p-2 rounded-md bg-slate-100 group-hover:bg-white transition-colors">
                <FaGlobe style={{ color: accentColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium">Website</p>
                <p className="text-slate-700 truncate">{data.website}</p>
              </div>
            </div>
          )}

          {data.address && (
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="p-2 rounded-md bg-slate-100">
                <FaMapMarkerAlt style={{ color: accentColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium">Address</p>
                <p className="text-slate-700 text-xs line-clamp-2">{data.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
