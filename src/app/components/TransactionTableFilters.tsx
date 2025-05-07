"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedType: "All" | "Credit" | "Debit";
  setSelectedType: (val: "All" | "Credit" | "Debit") => void;
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  uniqueCategories: string[];
}

export default function TransactionTableFilters({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedMonth,
  setSelectedMonth,
  uniqueCategories,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Category Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Category</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Type</label>
        <Select
          value={selectedType}
          onValueChange={(val: "All" | "Credit" | "Debit") =>
            setSelectedType(val)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Credit">Credit</SelectItem>
            <SelectItem value="Debit">Debit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Month Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Date Range</label>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All time</SelectItem>
            <SelectItem value="1m">Past 1 month</SelectItem>
            <SelectItem value="3m">Past 3 months</SelectItem>
            <SelectItem value="6m">Past 6 months</SelectItem>
            <SelectItem value="1y">Past 1 year</SelectItem>
            <SelectItem value="2y">Past 2 years</SelectItem>
            <SelectItem value="3y">Past 3 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
