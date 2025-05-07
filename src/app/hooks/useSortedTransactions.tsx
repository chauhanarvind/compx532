import { useMemo } from "react";
import { Transaction } from "./useFilteredTransactions"; // reuse same type

export type SortBy = "date" | "category" | "amount";

export default function useSortedTransactions(
  transactions: Transaction[],
  sortBy: SortBy
): Transaction[] {
  return useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (sortBy === "amount") return a.amount - b.amount;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [transactions, sortBy]);
}
