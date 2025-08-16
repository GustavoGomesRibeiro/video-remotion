import { useEffect, useState } from "react";
import { getAudioData } from "@remotion/media-utils";
import { useVideoConfig, delayRender, continueRender } from "remotion";

export type TimelineItem = {
  id: string;
  src: string; // caminho do áudio (staticFile(...) ou URL)
  padEndMs?: number; // folga ao final de CADA trecho (ms)
};

export type ScheduledItem = TimelineItem & {
  from: number; // frame de início
  durationInFrames: number;
};

export const useAudioTimeline = (
  items: TimelineItem[],
  defaultPadEndMs = 200,
) => {
  const { fps } = useVideoConfig();
  const [schedule, setSchedule] = useState<ScheduledItem[] | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  useEffect(() => {
    const handle = delayRender("useAudioTimeline");
    let cancelled = false;

    (async () => {
      try {
        const metas = await Promise.all(
          items.map(async (it) => {
            const data = await getAudioData(it.src);
            const ms =
              (data.durationInSeconds ?? 0) * 1000 +
              (it.padEndMs ?? defaultPadEndMs);
            const frames = Math.ceil((ms / 1000) * fps);
            return { id: it.id, src: it.src, frames };
          }),
        );

        let cursor = 0;
        const sch: ScheduledItem[] = metas.map((m, i) => {
          const out: ScheduledItem = {
            id: items[i].id,
            src: items[i].src,
            from: cursor,
            durationInFrames: m.frames,
            padEndMs: items[i].padEndMs ?? defaultPadEndMs,
          };
          cursor += m.frames;
          return out;
        });

        if (!cancelled) {
          setSchedule(sch);
          setTotalDuration(cursor);
        }
      } finally {
        continueRender(handle);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items, defaultPadEndMs, fps]);

  return { schedule, totalDuration };
};
