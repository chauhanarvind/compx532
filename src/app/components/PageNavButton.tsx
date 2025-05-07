"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PageNavButton() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/" || pathname === "/transactions";

  return (
    <div className="flex justify-end">
      <Button
        variant="outline"
        onClick={() => router.push(isHome ? "/timeline" : "/")}
      >
        {isHome ? "📊 Timeline View" : "📋 Transactions"}
      </Button>
    </div>
  );
}
