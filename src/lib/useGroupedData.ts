import { useMemo } from "react";

export interface Transaction {
  date: Date;
  account: string;
  category: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

export type GroupBy = "monthly" | "weekly";

const getGroupDate = (date: Date, groupBy: GroupBy): Date => {
  return groupBy === "monthly"
    ? new Date(date.getFullYear(), date.getMonth(), 1)
    : new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay()
      );
};

export function useGroupedData(transactions: Transaction[], groupBy: GroupBy) {
  const barData = useMemo(() => {
    const map: Record<
      string,
      { Credit: number; Debit: number; _dateKey: Date }
    > = {};

    transactions.forEach((t) => {
      const groupDate = getGroupDate(t.date, groupBy);
      const label =
        groupBy === "monthly"
          ? groupDate.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          : `Week of ${groupDate.toLocaleDateString("default", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}`;

      if (!map[label]) {
        map[label] = { Credit: 0, Debit: 0, _dateKey: groupDate };
      }

      map[label][t.type] += t.amount;
    });

    return Object.entries(map)
      .map(([period, { Credit, Debit, _dateKey }]) => ({
        period,
        Credit: parseFloat(Credit.toFixed(2)),
        Debit: parseFloat(Debit.toFixed(2)),
        _dateKey,
      }))
      .sort((a, b) => b._dateKey.getTime() - a._dateKey.getTime())
      .map(({ _dateKey, ...rest }) => rest); // Strip _dateKey before returning
  }, [transactions, groupBy]);

  const tooltipMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};

    transactions.forEach((t) => {
      const groupDate = getGroupDate(t.date, groupBy);
      const label =
        groupBy === "monthly"
          ? groupDate.toLocaleString("default", {
              month: "short",
              year: "numeric",
            })
          : `Week of ${groupDate.toLocaleDateString("default", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}`;

      if (!map[label]) map[label] = { Credit: 0, Debit: 0 };
      map[label][t.type] += t.amount;
    });

    return Object.fromEntries(
      Object.entries(map).map(([period, values]) => [
        period,
        {
          Credit: parseFloat((values.Credit || 0).toFixed(2)),
          Debit: parseFloat((values.Debit || 0).toFixed(2)),
        },
      ])
    );
  }, [transactions, groupBy]);

  const areaData = barData; // Same structure reused for consistency

  return { barData, tooltipMap, areaData };
}
