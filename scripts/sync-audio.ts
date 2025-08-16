import { useEffect, useMemo, useState } from "react";
import { getAudioData } from "@remotion/media-utils";
import { useVideoConfig, delayRender, continueRender } from "remotion";

export type Caption = { text: string; startMs: number; endMs: number };

type Options = {
  endPaddingMs?: number;
  startOffsetMs?: number;
  clampFactor?: [number, number];
};

export const useAudioSyncedCaptions = (
  captions: Caption[],
  narrationSrc: string,
  {
    endPaddingMs = 300,
    startOffsetMs = 0,
    clampFactor = [0.5, 2.0],
  }: Options = {},
) => {
  useVideoConfig(); // mantém compatível se quiser usar fps depois
  const [scaled, setScaled] = useState<Caption[] | null>(null);

  const lastEndMs = useMemo(
    () => Math.max(...captions.map((c) => c.endMs)),
    [captions],
  );

  useEffect(() => {
    const handle = delayRender("sync-captions:getAudioData");
    let cancelled = false;

    (async () => {
      try {
        const data = await getAudioData(narrationSrc);
        const audioMs = (data.durationInSeconds ?? 0) * 1000;

        const rawFactor = (audioMs - endPaddingMs) / Math.max(1, lastEndMs);
        const factor = Math.min(
          Math.max(rawFactor, clampFactor[0]),
          clampFactor[1],
        );

        const next = captions.map((c) => ({
          text: c.text,
          startMs: c.startMs * factor + startOffsetMs,
          endMs: c.endMs * factor + startOffsetMs,
        }));

        if (!cancelled) setScaled(next);
      } catch {
        // Fallback: mantém original com offset
        const next = captions.map((c) => ({
          ...c,
          startMs: c.startMs + startOffsetMs,
          endMs: c.endMs + startOffsetMs,
        }));
        if (!cancelled) setScaled(next);
      } finally {
        continueRender(handle);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    captions,
    narrationSrc,
    endPaddingMs,
    startOffsetMs,
    clampFactor,
    lastEndMs,
  ]);

  return scaled ?? captions;
};
