"use client";

import { chartColors } from "@/lib/chartColors";
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
  data: Record<string, any>[];
  categories: string[];
  onAreaClick?: (label: string) => void;
}

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
        {categories.map((cat, index) => (
          <Area
            key={cat}
            type="monotone"
            dataKey={cat}
            stackId="1"
            stroke={chartColors[index % chartColors.length]}
            fill={chartColors[index % chartColors.length]}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
