"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface Transaction {
  date: Date;
  account: string;
  category: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

export default function TimelinePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groupBy, setGroupBy] = useState<"monthly" | "weekly">("monthly");
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse("/transactions.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const parsed = data.map((t: any) => {
          const amt = parseFloat(t.amount);
          return {
            date: new Date(t.date),
            account: t.account,
            category: t.Category || "Uncategorized",
            description: t.description || "",
            amount: Math.abs(amt),
            type: amt < 0 ? "Debit" : "Credit",
          } as Transaction;
        });
        setTransactions(parsed);
      },
    });
  }, []);

  const categories = useMemo(() => {
    return [...new Set(transactions.map((t) => t.category))];
  }, [transactions]);

  const chartColors = [
    "#16a34a",
    "#dc2626",
    "#3b82f6",
    "#eab308",
    "#6366f1",
    "#d946ef",
  ];

  const groupedData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    transactions.forEach((t) => {
      const key =
        groupBy === "monthly"
          ? t.date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          : `Week of ${new Date(t.date).toLocaleString("default", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}`;

      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][t.category]) grouped[key][t.category] = 0;

      grouped[key][t.category] += t.amount;
    });

    return Object.entries(grouped)
      .map(([period, catMap]) => ({
        period,
        ...catMap,
      }))
      .sort(
        (a, b) =>
          new Date(a.period.split(" of ")[1] || a.period).getTime() -
          new Date(b.period.split(" of ")[1] || b.period).getTime()
      );
  }, [transactions, groupBy]);

  const highestDebit = useMemo(() => {
    let max = 0;
    let maxCat = "";
    transactions.forEach((t) => {
      if (t.type === "Debit" && t.amount > max) {
        max = t.amount;
        maxCat = t.category;
      }
    });
    return max > 0 ? { category: maxCat, amount: max } : null;
  }, [transactions]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">📊 Timeline View</h1>
        <div className="flex gap-3">
          <Select
            value={groupBy}
            onValueChange={(v) => setGroupBy(v as "monthly" | "weekly")}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={chartType}
            onValueChange={(v) => setChartType(v as "bar" | "line" | "area")}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {highestDebit && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            💡 Highest single debit: <b>${highestDebit.amount.toFixed(2)}</b> on{" "}
            <b>{highestDebit.category}</b>
          </CardContent>
        </Card>
      )}

      <motion.div layout>
        <Card>
          <CardHeader>
            <CardTitle>Spending by {groupBy}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" && (
                  <BarChart
                    data={groupedData}
                    onClick={(e) => setSelectedPeriod(e.activeLabel)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {categories.map((cat, i) => (
                      <Bar
                        key={cat}
                        dataKey={cat}
                        stackId="a"
                        fill={chartColors[i % chartColors.length]}
                      />
                    ))}
                  </BarChart>
                )}
                {chartType === "line" && (
                  <LineChart
                    data={groupedData}
                    onClick={(e) => setSelectedPeriod(e.activeLabel)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {categories.map((cat, i) => (
                      <Line
                        type="monotone"
                        key={cat}
                        dataKey={cat}
                        stroke={chartColors[i % chartColors.length]}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                )}
                {chartType === "area" && (
                  <AreaChart
                    data={groupedData}
                    onClick={(e) => setSelectedPeriod(e.activeLabel)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {categories.map((cat, i) => (
                      <Area
                        key={cat}
                        type="monotone"
                        dataKey={cat}
                        stackId="1"
                        stroke={chartColors[i % chartColors.length]}
                        fill={chartColors[i % chartColors.length]}
                      />
                    ))}
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Drilldown Modal */}
      <Dialog
        open={!!selectedPeriod}
        onOpenChange={() => setSelectedPeriod(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transactions in {selectedPeriod}</DialogTitle>
          </DialogHeader>
          <ul className="text-sm space-y-2 max-h-[300px] overflow-y-auto">
            {transactions
              .filter((t) => {
                const formattedMonth = t.date.toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                });
                return groupBy === "monthly"
                  ? selectedPeriod === formattedMonth
                  : selectedPeriod?.includes(
                      t.date.toLocaleDateString("default", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    );
              })
              .map((t, i) => (
                <li key={i}>
                  <b>{t.category}</b> — ${t.amount.toFixed(2)} ({t.type})
                  <br />
                  <span className="text-muted-foreground">{t.description}</span>
                </li>
              ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
