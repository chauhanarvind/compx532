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

interface BarChartStackedProps {
  data: Record<string, any>[];
  onBarClick?: (label: string) => void;
}

const COLORS = {
  Credit: "#16a34a",
  Debit: "#dc2626",
};

export default function BarChartStacked({
  data,
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
        <Bar dataKey="Credit" stackId="1" fill={COLORS.Credit} />
        <Bar dataKey="Debit" stackId="1" fill={COLORS.Debit} />
      </BarChart>
    </ResponsiveContainer>
  );
}
