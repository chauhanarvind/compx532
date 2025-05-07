"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  date: Date;
  account: string;
  category: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

interface DrilldownModalProps {
  open: boolean;
  onClose: () => void;
  selectedPeriod: string;
  transactions: Transaction[];
  groupBy: "monthly" | "weekly";
}

export default function DrilldownModal({
  open,
  onClose,
  selectedPeriod,
  transactions,
  groupBy,
}: DrilldownModalProps) {
  const filtered = transactions.filter((t) => {
    const month = t.date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const weekLabel = `Week of ${t.date.toLocaleDateString("default", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })}`;

    return groupBy === "monthly"
      ? selectedPeriod === month
      : selectedPeriod === weekLabel;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transactions in {selectedPeriod}</DialogTitle>
        </DialogHeader>
        <ul className="text-sm space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {filtered.length > 0 ? (
            filtered.map((t, i) => (
              <li key={i}>
                <div className="flex justify-between">
                  <div>
                    <b>{t.category}</b> — ${t.amount.toFixed(2)} ({t.type})
                    <div className="text-muted-foreground text-xs">
                      {t.description}
                    </div>
                  </div>
                  <div className="text-right text-muted-foreground text-xs">
                    {t.date.toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>No transactions in this period.</li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
