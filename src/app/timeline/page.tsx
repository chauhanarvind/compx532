"use client";

import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import { Transaction, useGroupedData } from "@/lib/useGroupedData";
import ChartWrapper from "../components/ChartWrapper";
import DrilldownModal from "../components/DrillDownModal";

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
          const amt = parseFloat(t.amount);
          const [day, month, year] = t.date.split("-");
          const parsedDate = new Date(`${year}-${month}-${day}`);
          return {
            date: parsedDate,
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

  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  const { barData, tooltipMap, areaData } = useGroupedData(
    transactions,
    groupBy
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">📊 Timeline View</h1>

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
