"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";
import { useEffect, useState, useMemo } from "react";

interface Transaction {
  date: string;
  account: string;
  category: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "category" | "amount">("date");

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

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (sortBy === "amount") return a.amount - b.amount;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [transactions, sortBy]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">📋 Transaction Table</h1>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => setSortBy("date")}
              >
                Date
              </TableHead>
              <TableHead>Account</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => setSortBy("category")}
              >
                Category
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => setSortBy("amount")}
              >
                Amount
              </TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((t, index) => (
              <TableRow key={index}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.account}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell
                  className={
                    t.type === "Debit"
                      ? "text-red-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  ${t.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-1 rounded-full ${
                      t.type === "Credit"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }`}
                  >
                    {t.type === "Credit" ? "💰 Credit" : "💸 Debit"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
