import React from "react";
import { FaAddressCard } from "react-icons/fa";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ResetButton } from "./ResetButton";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
            <FaAddressCard className="text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
              vCard<span className="text-emerald-500">Forge</span>
            </h1>
            <p className="hidden text-[10px] text-slate-500 dark:text-slate-400 sm:block">
              Premium Digital Business Card Generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ResetButton />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
