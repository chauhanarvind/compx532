import { Transaction } from "@/app/components/TransactionTable";

// Helper to convert 'dd-mm-yyyy' string into a JS Date object
function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

export function sortTransactionsByDate(
  transactions: Transaction[],
  order: "asc" | "desc" = "asc"
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const aDate = parseDDMMYYYY(a.date).getTime();
    const bDate = parseDDMMYYYY(b.date).getTime();
    return order === "asc" ? aDate - bDate : bDate - aDate;
  });
}
