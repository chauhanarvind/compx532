"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AreaChartStackedProps {
  data: Record<string, any>[]; // e.g., { period: "Mar 2025", Credit: 1500, Debit: 700 }
  categories: ("Credit" | "Debit")[]; // explicitly only these two
  onAreaClick?: (label: string) => void;
}

const COLORS = {
  Credit: "#16a34a", // green-600
  Debit: "#dc2626", // red-600
};

export default function AreaChartStacked({
  data,
  categories,
  onAreaClick,
}: AreaChartStackedProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} onClick={(e) => onAreaClick?.(e.activeLabel)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip
          formatter={(value: any) => `$${parseFloat(value).toFixed(2)}`}
        />
        <Legend />
        {categories.map((cat) => (
          <Area
            key={cat}
            type="monotone"
            dataKey={cat}
            stackId="1"
            stroke={COLORS[cat]}
            fill={COLORS[cat]}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
