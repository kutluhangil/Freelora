"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  deltaSuffix?: string;
  delay?: number;
  tone?: "default" | "income" | "expense" | "neutral";
}

const TONE_MAP = {
  default: "text-text-primary",
  income: "text-success",
  expense: "text-danger",
  neutral: "text-text-primary",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delta,
  deltaSuffix,
  delay = 0,
  tone = "default",
}: Props) {
  const positive = delta !== undefined && delta > 0;
  const negative = delta !== undefined && delta < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-bg-tertiary p-1.5 text-text-tertiary">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs uppercase tracking-wide text-text-tertiary">{label}</span>
            </div>
            <div className="space-y-1">
              <div
                className={cn("font-display text-2xl font-bold tracking-tight", TONE_MAP[tone])}
                data-tabular
              >
                {prefix}
                <CountUp
                  end={value}
                  duration={1.2}
                  separator=","
                  decimal="."
                  decimals={decimals}
                  preserveValue
                />
                {suffix}
              </div>
              {delta !== undefined && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-xs",
                    positive ? "text-success" : negative ? "text-danger" : "text-text-tertiary"
                  )}
                >
                  {positive && <ArrowUpRight className="h-3 w-3" />}
                  {negative && <ArrowDownRight className="h-3 w-3" />}
                  <span data-tabular>
                    {Math.abs(delta).toFixed(1)}%
                  </span>
                  {deltaSuffix && <span className="text-text-tertiary">{deltaSuffix}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
