"use client";

import Papa from "papaparse";
import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Transaction {
  date: string;
  account: string;
  category: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

export default function SummaryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    Papa.parse("/transactions.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const parsed = data.map((t: any) => {
          const amt = parseFloat(t.amount);
          return {
            date: t.date,
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

  const totalCredit = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Credit")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalDebit = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Debit")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const netBalance = totalCredit - totalDebit;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">💼 Financial Summary</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Total Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${totalCredit.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">Total Debit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${totalDebit.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle
              className={netBalance >= 0 ? "text-green-700" : "text-red-700"}
            >
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${netBalance.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground pt-2">
        Transactions loaded: {transactions.length}
      </p>
    </div>
  );
}
