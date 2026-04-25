"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";

interface Props {
  data: { id: string; name: string; color: string; net_profit: number }[];
  currencySymbol?: string;
}

export function ProjectProfitChart({ data, currencySymbol = "₺" }: Props) {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-xs text-text-tertiary">
        No project data
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="h-[260px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <XAxis
            type="number"
            tick={{ fill: "#6B6B70", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${currencySymbol}${(Number(v) / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: "#A1A1A6", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(200,255,0,0.04)" }}
            contentStyle={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "10px",
              fontSize: "12px",
            }}
            formatter={(v: number) => `${currencySymbol}${v.toLocaleString()}`}
          />
          <Bar dataKey="net_profit" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((d) => (
              <Cell key={d.id} fill={d.net_profit >= 0 ? "#C8FF00" : "#F87171"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
