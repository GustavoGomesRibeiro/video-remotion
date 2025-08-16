import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import { useAudioSyncedCaptions } from "../../scripts/sync-audio";

export type Caption = {
  text: string;
  startMs: number;
  endMs: number;
};

type Options = {
  endPaddingMs?: number;
  startOffsetMs?: number;
  clampFactor?: [number, number];
  extraEndPaddingMs?: number;
};

/**
 * Sincroniza captions com o áudio e expõe utilidades de tempo.
 */
export function useSyncedCaptions(
  captions: Caption[],
  narrationSrc: string,
  {
    endPaddingMs = 250,
    startOffsetMs = 0,
    clampFactor = [0.6, 1.6],
    extraEndPaddingMs = 0,
  }: Options = {},
) {
  const { fps } = useVideoConfig();

  const syncedRaw = useAudioSyncedCaptions(captions, narrationSrc, {
    endPaddingMs,
    startOffsetMs,
    clampFactor,
  }) as Caption[] | undefined;

  const items = useMemo<Caption[]>(() => {
    return (syncedRaw?.length ? syncedRaw : captions) ?? [];
  }, [syncedRaw, captions]);

  const endMs = useMemo(() => {
    if (!items.length) return 0;
    return Math.max(...items.map((c) => c.endMs ?? 0));
  }, [items]);

  const endWithPaddingMs = endMs + endPaddingMs + extraEndPaddingMs;

  const durationFrames = useMemo(() => {
    return Math.ceil((endWithPaddingMs / 1000) * fps);
  }, [endWithPaddingMs, fps]);

  return {
    items,
    endMs,
    endWithPaddingMs,
    durationFrames,
  };
}
