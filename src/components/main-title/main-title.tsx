// import React, { useMemo } from "react";
// import {
//   useCurrentFrame,
//   interpolate,
//   Audio,
//   Sequence,
//   AbsoluteFill,
//   useVideoConfig,
// } from "remotion";

// import { useAudioSyncedCaptions } from "../../../scripts/sync-audio";
// import { Captions } from "../captions/captions";
// import BoxPerguntas from "../BoxPerguntas";
// import { settings } from "../../assets/config/setting";
// import { Caption } from "@remotion/captions";

// type MainTitleProps = {
//   narrationSrc: string;
//   captions: Caption[];
//   bgAudioSrc?: string;
//   bgVolume?: number;
// };

// export const MainTitle: React.FC<MainTitleProps> = ({
//   narrationSrc,
//   captions,
//   bgAudioSrc,
//   bgVolume = 0.05,
// }) => {
//   const { fps } = useVideoConfig();
//   const frame = useCurrentFrame();
//   const startAtMs = 0;
//   const extraEndPaddingMs = 300;

//   const scale = interpolate(frame, [20, 50], [0.8, 1], {
//     extrapolateLeft: "clamp",
//     extrapolateRight: "clamp",
//   });
//   const opacity = interpolate(frame, [20, 50], [0, 1], {
//     extrapolateLeft: "clamp",
//     extrapolateRight: "clamp",
//   });

//   // 🔑 sincroniza automaticamente ao áudio
//   const synced = useAudioSyncedCaptions(captions, narrationSrc, {
//     endPaddingMs: 250, // folga final
//     startOffsetMs: 0, // ajuste fino global (+ atrasa, - adianta)
//     clampFactor: [0.6, 1.6],
//   });

//   const captionsEndMs = useMemo(() => {
//     const arr = (synced?.length ? synced : captions) as Caption[];
//     if (!arr.length) return 0;
//     return Math.max(...arr.map((c) => c.endMs ?? 0));
//   }, [synced, captions]);

//   const startAtFrames = Math.round((startAtMs / 1000) * fps);
//   const captionsEndWithPaddingMs =
//     captionsEndMs + endPaddingMs + extraEndPaddingMs;
//   const captionsDurationFrames = Math.ceil(
//     (captionsEndWithPaddingMs / 1000) * fps,
//   );

//   const durationInFrames = audioData
//     ? Math.max(audioDurationInFrames, captionsDurationFrames)
//     : captionsDurationFrames;

//   return (
//     <Sequence>
//       {bgAudioSrc && <Audio src={bgAudioSrc} volume={bgVolume} />}
//       <Audio src={narrationSrc} />

//       <AbsoluteFill className="flex flex-col items-center gap-6 text-center">
//         <div
//           className="text-center mb-8 flex flex-col items-center justify-center gap-6"
//           style={{
//             fontFamily: "Lilita One",
//             transform: `scale(${scale})`,
//             opacity,
//           }}
//         >
//           <BoxPerguntas>{settings.titulo}</BoxPerguntas>

//           <div className="mt-40">
//             <Captions items={synced} />
//           </div>
//         </div>
//       </AbsoluteFill>
//     </Sequence>
//   );
// };

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   useCurrentFrame,
//   interpolate,
//   Audio,
//   Sequence,
//   useVideoConfig,
//   AbsoluteFill,
// } from "remotion";
// import { getAudioData } from "@remotion/media-utils";

// import { useAudioSyncedCaptions } from "../../../scripts/sync-audio";
// import { Captions } from "../captions/captions";
// import BoxPerguntas from "../BoxPerguntas";
// import { settings } from "../../assets/config/setting";

// type Caption = {
//   text: string;
//   startMs: number;
//   endMs: number;
// };

// type MainTitleProps = {
//   narrationSrc: string;
//   captions: Caption[];
//   bgAudioSrc?: string;
//   bgVolume?: number;
//   startAtMs?: number;
//   extraEndPaddingMs?: number;
// };

// export const MainTitle: React.FC<MainTitleProps> = ({
//   narrationSrc,
//   captions,
//   bgAudioSrc,
//   bgVolume = 0.05,
//   startAtMs = 0,
//   extraEndPaddingMs = 300,
// }) => {
//   const { fps } = useVideoConfig();
//   const frame = useCurrentFrame();

//   const [audioData, setAudioData] = useState<any | null>(null);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const data = await getAudioData(narrationSrc);
//         if (!cancelled) setAudioData(data);
//       } catch (e) {
//         console.warn("Erro ao carregar áudio:", e);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [narrationSrc]);

//   // 🔑 calcula duração sem usar função deprecated
//   const audioDurationInFrames = useMemo(() => {
//     if (!audioData?.durationInSeconds) return 0;
//     return Math.ceil(audioData.durationInSeconds * fps);
//   }, [audioData, fps]);

//   // sincronização legendas
//   const endPaddingMs = 250;
//   const synced = useAudioSyncedCaptions(captions, narrationSrc, {
//     endPaddingMs,
//     startOffsetMs: 0,
//     clampFactor: [0.6, 1.6],
//   });

//   const captionsEndMs = useMemo(() => {
//     const arr = (synced?.length ? synced : captions) as Caption[];
//     if (!arr.length) return 0;
//     return Math.max(...arr.map((c) => c.endMs ?? 0));
//   }, [synced, captions]);

//   const startAtFrames = Math.round((startAtMs / 1000) * fps);
//   const captionsEndWithPaddingMs =
//     captionsEndMs + endPaddingMs + extraEndPaddingMs;
//   const captionsDurationFrames = Math.ceil(
//     (captionsEndWithPaddingMs / 1000) * fps,
//   );

//   const durationInFrames = audioData
//     ? Math.max(audioDurationInFrames, captionsDurationFrames)
//     : captionsDurationFrames;

//   const scale = interpolate(frame, [20, 50], [0.8, 1], {
//     extrapolateLeft: "clamp",
//     extrapolateRight: "clamp",
//   });
//   const opacity = interpolate(frame, [20, 50], [0, 1], {
//     extrapolateLeft: "clamp",
//     extrapolateRight: "clamp",
//   });

//   return (
//     <Sequence from={startAtFrames} durationInFrames={durationInFrames}>
//       {bgAudioSrc && <Audio src={bgAudioSrc} volume={bgVolume} />}
//       <Audio src={narrationSrc} />

//       <AbsoluteFill className="flex flex-col items-center gap-6 text-center">
//         <div
//           className="text-center mb-8 flex flex-col items-center justify-center gap-6"
//           style={{
//             fontFamily: "Lilita One",
//             transform: `scale(${scale})`,
//             opacity,
//           }}
//         >
//           <BoxPerguntas>{settings.titulo}</BoxPerguntas>
//           <div className="mt-40">
//             <Captions items={synced} />
//           </div>
//         </div>
//       </AbsoluteFill>
//     </Sequence>
//   );
// };

import React, { useEffect, useMemo, useState } from "react";
import {
  useCurrentFrame,
  interpolate,
  Audio,
  Sequence,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";
import { getAudioData } from "@remotion/media-utils";

import { Captions } from "../captions/captions";
import BoxPerguntas from "../BoxPerguntas";
import { settings } from "../../assets/config/setting";
import { useSyncedCaptions, type Caption } from "../../hooks/use-caption";
import { NumberedList } from "../numbered-list/numbered-list";

type MainTitleProps = {
  narrationSrc: string;
  captions: Caption[];
  bgAudioSrc?: string;
  bgVolume?: number;
  startAtMs?: number;
  extraEndPaddingMs?: number;
  /** Callback opcional para informar a duração total calculada da intro (em frames). */
  onDurationComputed?: (durationInFrames: number) => void;
};

export const MainTitle: React.FC<MainTitleProps> = ({
  narrationSrc,
  captions,
  bgAudioSrc,
  bgVolume = 0.05,
  startAtMs = 0,
  extraEndPaddingMs = 300,
  onDurationComputed,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const [audioData, setAudioData] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAudioData(narrationSrc);
        if (!cancelled) setAudioData(data);
      } catch (e) {
        console.warn("Erro ao carregar áudio:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [narrationSrc]);

  // duração do áudio (frames)
  const audioDurationInFrames = useMemo(() => {
    if (!audioData?.durationInSeconds) return 0;
    return Math.ceil(audioData.durationInSeconds * fps);
  }, [audioData, fps]);

  // sincronização + duração das legendas (frames)
  const { items: synced, durationFrames: captionsDurationFrames } =
    useSyncedCaptions(captions, narrationSrc, {
      endPaddingMs: 250,
      startOffsetMs: 0,
      clampFactor: [0.6, 1.6],
      extraEndPaddingMs,
    });

  // duração total da intro = max(áudio, legendas)
  const durationInFrames = useMemo(() => {
    return Math.max(audioDurationInFrames, captionsDurationFrames);
  }, [audioDurationInFrames, captionsDurationFrames]);

  // informa para o pai (opcional)
  useEffect(() => {
    if (onDurationComputed && durationInFrames > 0) {
      onDurationComputed(durationInFrames);
    }
  }, [durationInFrames, onDurationComputed]);

  const startAtFrames = Math.round((startAtMs / 1000) * fps);

  const scale = interpolate(frame, [20, 50], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Sequence from={startAtFrames} durationInFrames={durationInFrames}>
      {bgAudioSrc && <Audio src={bgAudioSrc} volume={bgVolume} />}
      <Audio src={narrationSrc} />

      <AbsoluteFill className="flex flex-col items-center gap-6 text-center">
        <div
          className="text-center mb-8 flex flex-col items-center justify-center gap-6"
          style={{
            fontFamily: "Lilita One",
            transform: `scale(${scale})`,
            opacity,
          }}
        >
          <BoxPerguntas>{settings.titulo}</BoxPerguntas>
          <div className="mt-6">
            <Captions items={synced} />
          </div>
        </div>
      </AbsoluteFill>
      {/* <div className="flex justify-between items-start mt-150">
        <NumberedList />
      </div> */}
    </Sequence>
  );
};
