"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

interface CategoryRow {
  category: string;
  total: number;
}

interface Props {
  data: CategoryRow[];
  currencySymbol?: string;
}

const COLORS = ["#C8FF00", "#34D399", "#60A5FA", "#F87171", "#FBBF24", "#A78BFA", "#F472B6", "#38BDF8"];

export function CategoryBreakdown({ data, currencySymbol = "₺" }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-text-tertiary">
        Veri yok
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="h-[280px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
        >
          <XAxis
            type="number"
            tick={{ fill: "#6B6B70", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${currencySymbol}${(Number(v) / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fill: "#A1A1A6", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "10px",
              fontSize: "12px",
            }}
            formatter={(v: number) => `${currencySymbol}${v.toLocaleString()}`}
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
