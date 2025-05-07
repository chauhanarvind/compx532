"use client";

import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionTableFilters from "./TransactionTableFilters";
import PageNavButton from "./PageNavButton";
import { sortTransactionsByDate } from "@/lib/sortByDate";

export interface Transaction {
  date: string;
  account: string;
  category: string;
  description: string;
  amount: number;
  incomeOrExpense: "Credit" | "Debit";
}

export interface RawData {
  date: string;
  account: string;
  Category: string;
  description: string;
  amount: number;
}

const monthMap = {
  "1m": 0,
  "3m": 2,
  "6m": 5,
  "1y": 11,
  "2y": 23,
  "3y": 35,
} as const;

type AllowedMonthKey = keyof typeof monthMap;

const parseDDMMYYYY = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<"All" | "Credit" | "Debit">(
    "All"
  );
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [rowsToShow, setRowsToShow] = useState(50);

  useEffect(() => {
    Papa.parse("/transactions.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const parsed: Transaction[] = (data as RawData[]).map((t) => {
          const amt = parseFloat(t.amount as unknown as string);
          return {
            date: t.date,
            account: t.account,
            category: t.Category || "Uncategorized",
            description: t.description || "",
            amount: Math.abs(amt),
            incomeOrExpense: amt < 0 ? "Debit" : "Credit",
          };
        });

        setTransactions(sortTransactionsByDate(parsed, "desc"));
      },
    });
  }, []);

  useEffect(() => {
    setRowsToShow(50);
  }, [selectedCategory, selectedType, selectedMonth]);

  const uniqueCategories = useMemo(
    () => ["All", ...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    if (!transactions.length) return [];

    const latestTxDate = parseDDMMYYYY(transactions[0].date);

    return transactions.filter((t) => {
      const txDate = parseDDMMYYYY(t.date);
      const monthsDiff =
        (latestTxDate.getFullYear() - txDate.getFullYear()) * 12 +
        (latestTxDate.getMonth() - txDate.getMonth());

      const allowedMonths = monthMap[selectedMonth as AllowedMonthKey];

      const categoryMatch =
        selectedCategory === "All" || t.category === selectedCategory;
      const typeMatch =
        selectedType === "All" || t.incomeOrExpense === selectedType;
      const dateMatch =
        selectedMonth === "All" ||
        (typeof allowedMonths === "number" && monthsDiff <= allowedMonths);

      return categoryMatch && typeMatch && dateMatch;
    });
  }, [transactions, selectedCategory, selectedType, selectedMonth]);

  const visibleTransactions = filteredTransactions.slice(0, rowsToShow);
  const hasMore = filteredTransactions.length > visibleTransactions.length;

  const totalCredit = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.incomeOrExpense === "Credit")
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalDebit = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.incomeOrExpense === "Debit")
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const netBalance = totalCredit - totalDebit;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📋 Transactions Table</h1>
        <PageNavButton />
      </div>

      {/* Summary Section */}
      <div className="flex gap-4 flex-wrap">
        <Card className="flex-1 min-w-[180px]">
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

        <Card className="flex-1 min-w-[180px]">
          <CardHeader>
            <CardTitle className="text-green-700">Total Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${totalCredit.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[180px]">
          <CardHeader>
            <CardTitle className="text-red-700">Total Debit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">${totalDebit.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <TransactionTableFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        uniqueCategories={uniqueCategories}
      />

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTransactions.map((t, index) => (
              <TableRow key={index}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.account}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell
                  className={
                    t.incomeOrExpense === "Debit"
                      ? "text-red-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  ${t.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore ? (
        <div className="text-center">
          <button
            onClick={() => setRowsToShow((prev) => prev + 50)}
            className="px-4 py-2 mt-4 border rounded hover:bg-muted"
          >
            Load More
          </button>
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-sm mt-4">
          No more transactions.
        </div>
      )}
    </div>
  );
}
