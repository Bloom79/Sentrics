import React from "react";

interface GaugeProps {
  value: number;
  max: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  max,
  label,
  size = "md",
  showValue = true,
}) => {
  const percentage = (value / max) * 100;
  const radius = size === "sm" ? 40 : size === "md" ? 60 : 80;
  const strokeWidth = size === "sm" ? 8 : size === "md" ? 12 : 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        className="transform -rotate-90"
        width={radius * 2 + strokeWidth}
        height={radius * 2 + strokeWidth}
      >
        <circle
          className="text-muted-foreground/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
        />
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
      )}
    </div>
  );
};