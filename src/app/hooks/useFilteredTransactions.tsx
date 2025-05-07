import { useMemo } from "react";

export interface Transaction {
  date: string;
  account: string;
  category: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

interface UseFilteredTransactionsProps {
  transactions: Transaction[];
  selectedCategory: string;
  selectedType: "All" | "Credit" | "Debit";
  selectedMonth: string;
  minAmount: number;
  maxAmount: number;
}

export default function useFilteredTransactions({
  transactions,
  selectedCategory,
  selectedType,
  selectedMonth,
  minAmount,
  maxAmount,
}: UseFilteredTransactionsProps): Transaction[] {
  return useMemo(() => {
    return transactions.filter((t) => {
      const categoryMatch =
        selectedCategory === "All" || t.category === selectedCategory;
      const typeMatch = selectedType === "All" || t.type === selectedType;
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const monthMatch = selectedMonth === "All" || month === selectedMonth;
      const amountMatch = t.amount >= minAmount && t.amount <= maxAmount;
      return categoryMatch && typeMatch && monthMatch && amountMatch;
    });
  }, [
    transactions,
    selectedCategory,
    selectedType,
    selectedMonth,
    minAmount,
    maxAmount,
  ]);
}
