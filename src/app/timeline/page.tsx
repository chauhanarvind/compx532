"use client";

import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import { Transaction, useGroupedData } from "@/lib/useGroupedData";
import ChartWrapper from "../components/ChartWrapper";
import DrilldownModal from "../components/DrillDownModal";
import PageNavButton from "../components/PageNavButton";

const isValidTransactionRow = (row: any) => {
  if (!row.date || !row.amount || isNaN(Number(row.amount))) return false;
  const parsedDate = new Date(row.date);
  return parsedDate.toString() !== "Invalid Date";
};

export default function TimelinePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groupBy, setGroupBy] = useState<"monthly" | "weekly">("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse("/transactions.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const parsed: Transaction[] = data.map((t: any) => {
          const [day, month, year] = t.date.split("-").map(Number);
          const amt = parseFloat(t.amount);

          return {
            date: new Date(year, month - 1, day), // Correct order!
            account: t.account,
            category: t.Category || "Uncategorized",
            description: t.description || "",
            amount: Math.abs(amt),
            type: amt < 0 ? "Debit" : "Credit",
          };
        });

        setTransactions(parsed);
      },
    });
  }, []);

  const categories = useMemo(() => ["Credit", "Debit"], []);

  const { barData, tooltipMap, areaData } = useGroupedData(
    transactions,
    groupBy
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📊 Timeline View</h1>
        <PageNavButton />
      </div>

      <ChartWrapper
        barData={barData}
        tooltipMap={tooltipMap}
        areaData={areaData}
        categories={categories}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      <DrilldownModal
        open={!!selectedPeriod}
        onClose={() => setSelectedPeriod(null)}
        selectedPeriod={selectedPeriod!}
        transactions={transactions}
        groupBy={groupBy}
      />
    </div>
  );
}
