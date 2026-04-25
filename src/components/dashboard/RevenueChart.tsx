"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

interface Props {
  data: { month_label: string; income: number; expense: number }[];
  currencySymbol?: string;
}

export function RevenueChart({ data, currencySymbol = "₺" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-[260px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#F87171" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" vertical={false} />
          <XAxis
            dataKey="month_label"
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
          <Area
            type="monotone"
            dataKey="income"
            stroke="#34D399"
            strokeWidth={2}
            fill="url(#incomeGrad)"
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#F87171"
            strokeWidth={2}
            fill="url(#expenseGrad)"
            name="Expense"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
