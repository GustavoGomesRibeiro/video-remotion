import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export type NumberedEntry = {
  index: number; // 0-based
  answerFrom: number; // frame em que a resposta começa
  answerText: string; // texto da resposta (sem letras)
};

type Props = {
  entries: NumberedEntry[]; // ex.: 10 itens
  // opcional: ajuste de animação da caixa numerada
  baseDelayPerItem?: number; // frames entre cada box (default 5)
};

export const NumberedList: React.FC<Props> = ({
  entries,
  baseDelayPerItem = 5,
}) => {
  const frame = useCurrentFrame();
  const total = entries.length;

  return (
    <div className="flex flex-col gap-3">
      {entries.map((e, i) => {
        // Animação do bloco numérico (como antes)
        const delay = i * baseDelayPerItem;
        const boxOpacity = interpolate(
          frame,
          [30 + delay, 50 + delay],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const boxTranslateX = interpolate(
          frame,
          [30 + delay, 50 + delay],
          [-20, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        // Animação da resposta quando chegar o answerFrom
        const local = Math.max(0, frame - e.answerFrom); // tempo decorrido desde o start
        const answerOpacity = interpolate(local, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const answerTranslateY = interpolate(local, [0, 10], [8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const showAnswer = frame >= e.answerFrom;

        return (
          <div
            key={i}
            className="flex items-center gap-4"
            style={{
              opacity: boxOpacity,
              transform: `translateX(${boxTranslateX}px)`,
            }}
          >
            <div className="w-24 h-24 bg-black/60 rounded-lg flex items-center justify-center border-2 border-white/30">
              <span
                className="text-white font-bold"
                style={{
                  fontFamily: "Lilita One",
                  fontSize: 65,
                  lineHeight: 1,
                }}
              >
                {i + 1}
                {i === total - 1 && "."}
              </span>
            </div>

            <div
              className="text-white text-2xl font-bold leading-snug"
              style={{
                fontFamily: "Lilita One",
                fontSize: 60,
                opacity: showAnswer ? answerOpacity : 0,
                transform: showAnswer
                  ? `translateY(${answerTranslateY}px)`
                  : "translateY(6px)",
                whiteSpace: "nowrap",
              }}
            >
              {showAnswer ? `${e.answerText}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};
