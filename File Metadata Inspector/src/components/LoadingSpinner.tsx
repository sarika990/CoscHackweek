import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <motion.div
      className={cn(
        "rounded-full border-2 border-surface-700 border-t-brand-500",
        sizes[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function MetadataCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-800/60 border border-surface-700/50 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-surface-700" />
        <div className="h-5 w-16 rounded-full bg-surface-700" />
      </div>
      <div className="h-8 w-24 rounded-lg bg-surface-700 mb-2" />
      <div className="h-4 w-32 rounded bg-surface-700/70" />
    </div>
  );
}

export function FileRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-surface-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 rounded bg-surface-700" />
        <div className="h-3 w-32 rounded bg-surface-700/70" />
      </div>
      <div className="h-4 w-20 rounded bg-surface-700" />
    </div>
  );
}

export function MetadataTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-36 rounded bg-surface-700" />
          <div className="h-4 flex-1 rounded bg-surface-700/60" />
        </div>
      ))}
    </div>
  );
}
