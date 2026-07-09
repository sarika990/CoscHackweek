import React, { useState } from "react";
import { useCard } from "../context/CardContext";
import { ModernTemplate } from "../templates/ModernTemplate";
import { CorporateTemplate } from "../templates/CorporateTemplate";
import { MinimalTemplate } from "../templates/MinimalTemplate";
import { GradientTemplate } from "../templates/GradientTemplate";
import { GlassmorphismTemplate } from "../templates/GlassmorphismTemplate";
import { SocialLinks } from "./SocialLinks";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaRegCopy } from "react-icons/fa";

export const CardPreview = ({ exportId }) => {
  const { cardData, selectedTemplate, accentColor, selectedFont, cardStyle, setCardStyle } = useCard();
  const [toastMessage, setToastMessage] = useState("");

  const copyField = (label, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => {
        setToastMessage(`Copied ${label}!`);
        setTimeout(() => setToastMessage(""), 2500);
      })
      .catch(() => {
        setToastMessage("Failed to copy");
        setTimeout(() => setToastMessage(""), 2500);
      });
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "corporate":
        return <CorporateTemplate data={cardData} accentColor={accentColor} selectedFont={selectedFont} cardStyle={cardStyle} copyField={copyField} />;
      case "minimal":
        return <MinimalTemplate data={cardData} accentColor={accentColor} selectedFont={selectedFont} cardStyle={cardStyle} copyField={copyField} />;
      case "gradient":
        return <GradientTemplate data={cardData} accentColor={accentColor} selectedFont={selectedFont} cardStyle={cardStyle} copyField={copyField} />;
      case "glassmorphism":
        return <GlassmorphismTemplate data={cardData} accentColor={accentColor} selectedFont={selectedFont} cardStyle={cardStyle} copyField={copyField} />;
      case "modern":
      default:
        return <ModernTemplate data={cardData} accentColor={accentColor} selectedFont={selectedFont} cardStyle={cardStyle} copyField={copyField} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Accent/Shape controls for the card styling */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/60 w-fit">
        <button
          onClick={() => setCardStyle("rounded")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            cardStyle === "rounded"
              ? "bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          Rounded
        </button>
        <button
          onClick={() => setCardStyle("square")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            cardStyle === "square"
              ? "bg-white dark:bg-slate-800 shadow-sm text-slate-800 dark:text-white"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          Square
        </button>
      </div>

      {/* Actual Exportable Card Container */}
      <div className="relative w-full flex justify-center py-4 px-2">
        {/* Glow Effects in the dark mode behind the card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 dark:from-emerald-500/10 dark:to-blue-500/10 blur-3xl pointer-events-none rounded-2xl" />

        <div id={exportId} className="w-full flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTemplate}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex justify-center"
            >
              {renderTemplate()}
            </motion.div>
          </AnimatePresence>

          {/* Social Links shown directly attached/layered below the card preview */}
          <div className="w-full max-w-md">
            <SocialLinks socials={cardData.socials} accentColor={accentColor} />
          </div>
        </div>
      </div>

      {/* Copy notification popup toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 z-50 flex items-center gap-2 bg-slate-905 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 dark:border-slate-100 text-xs font-semibold"
          >
            <FaCheckCircle className="text-emerald-500 text-sm shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
