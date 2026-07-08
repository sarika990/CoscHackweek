import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetadataCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  unit?: string;
  color: "brand" | "emerald" | "amber" | "rose";
  delay?: number;
}

const COLOR_MAP = {
  brand: {
    icon: "bg-brand-500/15 border-brand-500/25 text-brand-400",
    value: "text-brand-300",
    glow: "shadow-brand-900/30",
  },
  emerald: {
    icon: "bg-emerald-500/15 border-emerald-500/25 text-emerald-400",
    value: "text-emerald-300",
    glow: "shadow-emerald-900/30",
  },
  amber: {
    icon: "bg-amber-500/15 border-amber-500/25 text-amber-400",
    value: "text-amber-300",
    glow: "shadow-amber-900/30",
  },
  rose: {
    icon: "bg-rose-500/15 border-rose-500/25 text-rose-400",
    value: "text-rose-300",
    glow: "shadow-rose-900/30",
  },
};

function AnimatedCounter({ value, unit }: { value: number; unit?: string }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const displayValue = useTransform(springValue, (v) => {
    if (unit) return `${v.toFixed(1)} ${unit}`;
    return Math.floor(v).toString();
  });

  const prevValueRef = useRef(0);

  useEffect(() => {
    motionValue.set(prevValueRef.current);
    motionValue.set(value);
    prevValueRef.current = value;
  }, [value, motionValue]);

  return <motion.span>{displayValue}</motion.span>;
}

export function MetadataCard({ label, value, icon: Icon, unit, color, delay = 0 }: MetadataCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <motion.div
      className={cn(
        "rounded-2xl bg-surface-800/60 border border-surface-700/50 p-5 hover:bg-surface-800/80 transition-all duration-300",
        "shadow-lg", colors.glow,
        "hover:border-surface-600/60 group cursor-default"
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl border transition-transform group-hover:scale-110 duration-300", colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className={cn("text-3xl font-bold tracking-tight mb-1 font-mono", colors.value)}>
        <AnimatedCounter value={value} unit={unit} />
      </div>

      <div className="text-sm text-surface-400 font-medium">{label}</div>
    </motion.div>
  );
}
