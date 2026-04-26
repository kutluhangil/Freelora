"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface Props {
  data: { month: string; income: number; expense: number }[];
  currencySymbol?: string;
}

export function RevenueReport({ data, currencySymbol = "₺" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6B6B70", fontSize: 11 }}
            axisLine={{ stroke: "#2A2A2E" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B6B70", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${currencySymbol}${(Number(v) / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "10px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "var(--color-text-tertiary)" }}
            formatter={(v: number) => `${currencySymbol}${v.toLocaleString()}`}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "var(--color-text-secondary)" }}
          />
          <Bar dataKey="income" fill="#34D399" radius={[4, 4, 0, 0]} name="Gelir" maxBarSize={40} />
          <Bar dataKey="expense" fill="#F87171" radius={[4, 4, 0, 0]} name="Gider" maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
