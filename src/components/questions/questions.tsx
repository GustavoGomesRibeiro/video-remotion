import React from "react";
import { Sequence, Audio, AbsoluteFill, staticFile } from "remotion";
import { useSyncedCaptions, type Caption } from "../../hooks/use-caption";
import { Captions } from "../../components/captions/captions";
import BoxPerguntas from "../BoxPerguntas";
import { settings } from "../../assets/config/setting";

type QuestionSequenceProps = {
  questionAudio: string;
  questionCaptions?: Caption[];
  questionFrom: number;
  questionDuration: number;

  answerAudio?: string; // se não tiver, deixa sem áudio de resposta
  answerCaptions?: Caption[];
  answerFrom: number;
  answerDuration: number;
};

export const QuestionSequence: React.FC<QuestionSequenceProps> = ({
  questionAudio,
  questionCaptions = [],
  questionFrom,
  questionDuration,
  answerAudio,
  answerCaptions = [],
  answerFrom,
  answerDuration,
}) => {
  // ✅ Hooks dentro de um componente, não em loop/condição
  const { items: questionSynced } = useSyncedCaptions(
    questionCaptions,
    questionAudio,
  );

  const { items: answerSynced } = useSyncedCaptions(
    answerCaptions,
    answerAudio ?? "",
  );

  return (
    <>
      <Audio src={staticFile("audio-intro/song-steven.mp3")} volume={0.05} />

      {/* Pergunta */}
      <Sequence from={questionFrom} durationInFrames={questionDuration}>
        <Audio src={questionAudio} />
        <Audio src={staticFile(settings.timerAudio)} />

        <AbsoluteFill className="flex flex-col items-center gap-6 text-center">
          <BoxPerguntas>{settings.titulo}</BoxPerguntas>
          <div className="mt-6">
            <Captions items={questionSynced} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Resposta (se houver) */}
      {answerAudio && (
        <Sequence from={answerFrom} durationInFrames={answerDuration}>
          <Audio src={staticFile(settings.answerAudio)} />
          <Audio src={answerAudio} />
          <AbsoluteFill className="flex flex-col items-center gap-6 text-center">
            <BoxPerguntas>{settings.titulo}</BoxPerguntas>
            <div className="mt-6">
              <Captions items={answerSynced} />
            </div>
          </AbsoluteFill>
        </Sequence>
      )}
    </>
  );
};
