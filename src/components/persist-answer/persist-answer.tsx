// components/answer-footer/PersistentAnswerFooter.tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NumberedList } from "../numbered-list/numbered-list";

type Entry = {
  index: number;
  answerFrom: number; // frame em que a resposta começa
  answerText: string; // texto da resposta (sem letras)
};

export const PersistentAnswerFooter: React.FC<{ entries: Entry[] }> = ({
  entries,
}) => {
  const frame = useCurrentFrame();

  // Mostra apenas as respostas cujo "início" já passou
  const revealed = entries
    .filter((e) => frame >= e.answerFrom)
    .map((e) => `${e.index + 1}. ${e.answerText}`);

  return (
    <AbsoluteFill className="pointer-events-none flex flex-col justify-end">
      <div className="flex justify-between items-start px-12 pb-10 w-full">
        <NumberedList />
        <div className="text-2xl font-bold text-white whitespace-pre-line text-right">
          {revealed.join("\n")}
        </div>
      </div>
    </AbsoluteFill>
  );
};
