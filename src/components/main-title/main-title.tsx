import React from "react";
import { useCurrentFrame, interpolate, Audio } from "remotion";

import { useAudioSyncedCaptions } from "../../../scripts/sync-audio";
import { Captions } from "../captions/captions";
import BoxPerguntas from "../BoxPerguntas";

type MainTitleProps = {
  narrationSrc: string;
  captions: Caption[];
  bgAudioSrc?: string;
  bgVolume?: number;
};

export const MainTitle: React.FC<MainTitleProps> = ({
  narrationSrc,
  captions,
  bgAudioSrc,
  bgVolume = 0.05,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [20, 50], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 🔑 sincroniza automaticamente ao áudio
  const synced = useAudioSyncedCaptions(captions, narrationSrc, {
    endPaddingMs: 250, // folga final
    startOffsetMs: 0, // ajuste fino global (+ atrasa, - adianta)
    clampFactor: [0.6, 1.6],
  });

  return (
    <>
      {bgAudioSrc && <Audio src={bgAudioSrc} volume={bgVolume} />}
      <Audio src={narrationSrc} />

      <div
        className="text-center mb-8 flex flex-col items-center justify-center gap-6"
        style={{
          fontFamily: "Lilita One",
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <BoxPerguntas>QUIZ TESTE</BoxPerguntas>

        <div className="mt-40">
          <Captions items={synced} />
        </div>
      </div>
    </>
  );
};
