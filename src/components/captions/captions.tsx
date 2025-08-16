import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type Caption = { text: string; startMs: number; endMs: number };

export const Captions: React.FC<{ items: Caption[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMs = (frame / fps) * 1000;

  const active = useMemo(
    () => items.filter((c) => tMs >= c.startMs && tMs <= c.endMs),
    [items, tMs],
  );

  if (active.length === 0) return null;

  return (
    <div className="w-full flex items-center justify-center px-6">
      <div
        style={{
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 60,
          fontFamily: "Lilita One",
          lineHeight: 1.15,
          textAlign: "center",
          maxWidth: 820,
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))",
        }}
      >
        {active.map((c) => c.text).join(" ")}
      </div>
    </div>
  );
};
