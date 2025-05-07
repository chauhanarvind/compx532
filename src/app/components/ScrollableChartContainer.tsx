"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface ScrollableChartContainerProps<T> {
  data: T[];
  renderChart: (data: T[]) => React.ReactNode;
  step?: number;
  initialCount?: number;
}

export default function ScrollableChartContainer<T>({
  data,
  renderChart,
  step = 15,
  initialCount = 15,
}: ScrollableChartContainerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;

      // Load more if scrolled to within 100px of the right edge
      if (
        scrollLeft + clientWidth >= scrollWidth - 100 &&
        visibleCount < data.length &&
        !loading
      ) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + step, data.length));
          setLoading(false);
        }, 300); // Simulated loading delay
      }
    };

    const currentRef = containerRef.current;
    currentRef?.addEventListener("scroll", handleScroll);
    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, [data.length, step, visibleCount, loading]);

  const visibleData = data.slice(0, visibleCount);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-x-auto border rounded-md"
        style={{ paddingBottom: "8px" }}
      >
        <div style={{ minWidth: `${visibleData.length * 80}px` }}>
          {renderChart(visibleData)}
        </div>
      </div>

      {loading && (
        <div className="absolute bottom-0 right-2 flex items-center justify-end text-muted-foreground text-xs pr-2 pt-1">
          <Loader2 className="animate-spin w-4 h-4 mr-1" />
          Loading more…
        </div>
      )}
    </div>
  );
}
