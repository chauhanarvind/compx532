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

export interface ChartData {
  period: string;
  Credit?: number;
  Debit?: number;
}

interface AreaChartStackedProps {
  data: ChartData[];
  onAreaClick?: (label: string) => void;
}

export default function AreaChartStacked({
  data,
  onAreaClick,
}: AreaChartStackedProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        onClick={(e) =>
          e && e.activeLabel ? onAreaClick?.(e.activeLabel as string) : null
        }
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            typeof value === "number" ? `$${value.toFixed(2)}` : value
          }
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="Credit"
          stackId="1"
          stroke="#16a34a"
          fill="#16a34a"
        />
        <Area
          type="monotone"
          dataKey="Debit"
          stackId="1"
          stroke="#dc2626"
          fill="#dc2626"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
