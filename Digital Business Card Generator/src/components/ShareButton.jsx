import React from "react";
import { useShare } from "../hooks/useShare";
import { useCard } from "../context/CardContext";
import { FaShareAlt, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export const ShareButton = () => {
  const { cardData } = useCard();
  const { shareCard, shareStatus } = useShare();

  return (
    <div className="relative w-full">
      <button
        onClick={() => shareCard(cardData)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 hover:bg-emerald-100/80 transition-all border border-emerald-250/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <FaShareAlt className="text-sm shrink-0" />
        <span>Share Business Card</span>
      </button>

      <AnimatePresence>
        {shareStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`absolute left-0 right-0 top-full mt-2 p-2 rounded-lg text-center text-[10px] font-semibold flex items-center justify-center gap-1.5 shadow-sm border ${
              shareStatus.message.includes("fail") || shareStatus.message.includes("Could not")
                ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
            }`}
          >
            {shareStatus.message.includes("fail") || shareStatus.message.includes("Could not") ? (
              <FaExclamationTriangle />
            ) : (
              <FaCheck />
            )}
            <span>{shareStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
