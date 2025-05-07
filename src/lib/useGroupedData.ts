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
    const map: Record<string, { total: number; dateKey: Date }> = {};

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

      if (!map[label]) map[label] = { total: 0, dateKey: groupDate };
      map[label].total += t.amount;
    });

    return Object.entries(map)
      .map(([period, { total, dateKey }]) => ({
        period,
        total: parseFloat(total.toFixed(2)),
        _dateKey: dateKey,
      }))
      .sort((a, b) => b._dateKey.getTime() - a._dateKey.getTime()) // 🔁 DESCENDING
      .map(({ period, total }) => ({ period, total }));
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

      if (!map[label]) map[label] = {};
      if (!map[label][t.category]) map[label][t.category] = 0;

      map[label][t.category] += t.amount;
    });

    return Object.fromEntries(
      Object.entries(map).map(([period, catMap]) => [
        period,
        Object.fromEntries(
          Object.entries(catMap).map(([cat, val]) => [
            cat,
            parseFloat(val.toFixed(2)),
          ])
        ),
      ])
    );
  }, [transactions, groupBy]);

  const areaData = useMemo(() => {
    const map: Record<string, { dateKey: Date; cats: Record<string, number> }> =
      {};

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

      if (!map[label]) map[label] = { dateKey: groupDate, cats: {} };
      if (!map[label].cats[t.category]) map[label].cats[t.category] = 0;

      map[label].cats[t.category] += t.amount;
    });

    return Object.entries(map)
      .map(([period, { dateKey, cats }]) => ({
        period,
        ...Object.fromEntries(
          Object.entries(cats).map(([cat, val]) => [
            cat,
            parseFloat(val.toFixed(2)),
          ])
        ),
        _dateKey: dateKey,
      }))
      .sort((a, b) => b._dateKey.getTime() - a._dateKey.getTime()) // 🔁 DESCENDING
      .map(({ _dateKey, ...rest }) => rest);
  }, [transactions, groupBy]);

  return { barData, tooltipMap, areaData };
}
