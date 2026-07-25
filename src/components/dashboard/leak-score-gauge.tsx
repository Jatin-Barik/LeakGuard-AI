"use client";

import { motion } from "framer-motion";
import { cn, getLeakScoreColor, getLeakScoreLabel } from "@/lib/utils";

interface LeakScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function LeakScoreGauge({
  score,
  size = "md",
  showLabel = true,
  className,
}: LeakScoreGaugeProps) {
  const dimensions = { sm: 120, md: 180, lg: 240 };
  const dim = dimensions[size];
  const strokeWidth = size === "sm" ? 8 : size === "md" ? 12 : 16;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const getStrokeColor = (s: number) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#f59e0b";
    if (s >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn("font-bold tabular-nums", getLeakScoreColor(score), {
            "text-2xl": size === "sm",
            "text-4xl": size === "md",
            "text-5xl": size === "lg",
          })}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <span className="text-xs text-muted-foreground mt-1">
            {getLeakScoreLabel(score)}
          </span>
        )}
      </div>
    </div>
  );
}
