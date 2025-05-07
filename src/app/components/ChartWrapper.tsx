"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AreaChartStacked from "./AreaChartStacked";
import ScrollableChartContainer from "./ScrollableChartContainer";
import BarChartStacked from "./BarChartStacked";
import Spinner from "./Spinner";

export type GroupBy = "monthly" | "weekly";
export type ChartType = "bar" | "area";

interface ChartWrapperProps {
  barData: { period: string; total: number }[];
  areaData: Record<string, any>[]; // Contains Credit, Debit
  tooltipMap: Record<string, Record<string, number>>;
  categories: string[]; // ["Credit", "Debit"]
  groupBy: GroupBy;
  setGroupBy: (val: GroupBy) => void;
  selectedPeriod: string | null;
  setSelectedPeriod: (val: string | null) => void;
}

export default function ChartWrapper({
  barData,
  areaData,
  tooltipMap,
  categories,
  groupBy,
  setGroupBy,
  selectedPeriod,
  setSelectedPeriod,
}: ChartWrapperProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  const memoizedChart = useMemo(() => {
    return chartType === "bar" ? (
      <BarChartStacked
        data={areaData}
        categories={categories}
        onBarClick={setSelectedPeriod}
      />
    ) : (
      <AreaChartStacked
        data={areaData}
        categories={categories}
        onAreaClick={setSelectedPeriod}
      />
    );
  }, [areaData, chartType, categories, setSelectedPeriod]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-lg">Spending by {groupBy}</CardTitle>
        <div className="flex gap-2">
          <Select
            value={groupBy}
            onValueChange={(val) => setGroupBy(val as GroupBy)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={chartType}
            onValueChange={(val) => setChartType(val as ChartType)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {areaData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size={28} />
          </div>
        ) : (
          <ScrollableChartContainer
            data={areaData}
            renderChart={() => memoizedChart}
          />
        )}
      </CardContent>
    </Card>
  );
}
