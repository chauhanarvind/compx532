"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { chartColors } from "@/lib/chartColors";

interface BarChartStackedProps {
  data: Record<string, any>[]; // Example: [{ period: "Mar 2025", Food: 120, Rent: 400, ... }]
  categories: string[];
  onBarClick?: (label: string) => void;
}

export default function BarChartStacked({
  data,
  categories,
  onBarClick,
}: BarChartStackedProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} onClick={(e) => onBarClick?.(e.activeLabel)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" interval="preserveStartEnd" />
        <YAxis />
        <Tooltip
          formatter={(value: any) =>
            typeof value === "number" ? `$${value.toFixed(2)}` : value
          }
        />
        <Legend />
        {categories.map((cat, index) => (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="1"
            fill={chartColors[index % chartColors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
