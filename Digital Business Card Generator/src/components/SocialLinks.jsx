import React from "react";
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

export const SocialLinks = ({ socials, accentColor }) => {
  if (!socials) return null;

  const socialConfig = [
    { key: "linkedIn", icon: FaLinkedin, label: "LinkedIn" },
    { key: "gitHub", icon: FaGithub, label: "GitHub" },
    { key: "instagram", icon: FaInstagram, label: "Instagram" },
    { key: "twitter", icon: FaXTwitter, label: "X / Twitter" },
    { key: "facebook", icon: FaFacebook, label: "Facebook" },
    { key: "portfolio", icon: FaLink, label: "Portfolio" }
  ];

  // Only display links that the user has filled in
  const activeSocials = socialConfig.filter(s => socials[s.key] && socials[s.key].trim());

  if (activeSocials.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
      {activeSocials.map((social) => {
        const IconComponent = social.icon;
        
        return (
          <motion.a
            key={social.key}
            href={socials[social.key]}
            target="_blank"
            rel="noopener noreferrer"
            title={social.label}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-white border border-slate-205 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-750 text-slate-655 hover:text-white shadow-sm transition-colors duration-200"
            whileHover={{ 
              scale: 1.15,
              borderColor: accentColor,
              backgroundColor: accentColor,
              color: "#ffffff"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <IconComponent className="text-base" />
          </motion.a>
        );
      })}
    </div>
  );
};
