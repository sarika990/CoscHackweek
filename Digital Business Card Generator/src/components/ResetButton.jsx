import React from "react";
import { FaUndo } from "react-icons/fa";
import { useCard } from "../context/CardContext";

export const ResetButton = () => {
  const { resetForm } = useCard();

  return (
    <button
      onClick={resetForm}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-200/80 bg-rose-50/50 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      title="Reset Card Form and Styles"
    >
      <FaUndo className="text-[10px]" />
      <span>Reset</span>
    </button>
  );
};
