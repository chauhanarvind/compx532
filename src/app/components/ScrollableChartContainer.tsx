"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

interface ScrollableChartContainerProps<T> {
  data: T[];
  renderChart: (data: T[]) => React.ReactNode;
  step?: number;
  initialCount?: number;
  maxCount?: number;
}

export default function ScrollableChartContainer<T>({
  data,
  renderChart,
  step = 20,
  initialCount = 20,
  maxCount = 100,
}: ScrollableChartContainerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(initialCount < data.length);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial loading spinner on first render
  useEffect(() => {
    if (initialCount < data.length) {
      const t = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(t);
    }
  }, [initialCount, data.length]);

  // Horizontal scroll loader
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      if (
        scrollLeft + clientWidth >= scrollWidth - 100 &&
        visibleCount < Math.min(data.length, maxCount)
      ) {
        if (timeoutRef.current) return;
        setIsLoading(true);
        timeoutRef.current = setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + step, maxCount));
          setIsLoading(false);
          timeoutRef.current = null;
        }, 300);
      }
    };

    const ref = containerRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [visibleCount, step, maxCount, data.length]);

  const visibleData = data.slice(0, visibleCount);

  return (
    <div className="relative">
      <div className="flex border rounded-md overflow-hidden">
        <div
          ref={containerRef}
          className="overflow-x-auto w-full"
          style={{ paddingBottom: "8px" }}
        >
          <div style={{ minWidth: `${visibleData.length * 80}px` }}>
            {renderChart(visibleData)}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute bottom-2 right-4 z-10">
          <Spinner size={20} />
        </div>
      )}
    </div>
  );
}
