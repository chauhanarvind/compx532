"use client";

export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-muted border-t-primary"
      style={{ width: size, height: size, borderTopColor: "currentColor" }}
    />
  );
}
