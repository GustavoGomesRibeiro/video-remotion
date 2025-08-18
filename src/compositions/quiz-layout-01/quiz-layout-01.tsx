// import React, { useCallback, useMemo, useState } from "react";
// import {
//   useCurrentFrame,
//   useVideoConfig,
//   interpolate,
//   Easing,
//   staticFile,
//   Sequence,
// } from "remotion";
// import { DynamicBackground } from "../../components/dynamic-background/dynamic-background";
// import { NumberedList } from "../../components/numbered-list/numbered-list";
// import { MainTitle } from "../../components/main-title/main-title";
// import { intro } from "../../assets/config/captions.ts";
// import questions from "../../assets/config/json";
// import { QuestionSequence } from "../../components/questions/questions";

// interface QuizLayoutProps {
//   backgroundImages: string[];
//   quizTitle: string;
//   description: string;
// }

// export const QuizLayout01: React.FC<QuizLayoutProps> = ({
//   backgroundImages,
// }) => {
//   const frame = useCurrentFrame();
//   const { durationInFrames, fps } = useVideoConfig();

//   const opacity = interpolate(frame, [0, 30], [0, 1], {
//     extrapolateLeft: "clamp",
//     extrapolateRight: "clamp",
//     easing: Easing.out(Easing.cubic),
//   });

//   const translateY = interpolate(frame, [0, 30], [20, 0], {
//     extrapolateLeft: "clamp",
//     extrapolateRight: "clamp",
//     easing: Easing.out(Easing.cubic),
//   });

//   const selectedQuestions = useMemo(() => questions.slice(0, 10), []);

//   // util p/ duração do texto (em frames)
//   const calculateDuration = useCallback(
//     (text: string, baseSeconds = 4, charPerSecond = 15) => {
//       const durationInSeconds = Math.max(
//         baseSeconds,
//         Math.ceil(text.length / charPerSecond),
//       );
//       return durationInSeconds * fps;
//     },
//     [fps],
//   );

//   // duração dinâmica da intro (virá do MainTitle)
//   const [introDuration, setIntroDuration] = useState<number>(0);

//   // controla o início das sequências
//   let currentFrom = introDuration > 0 ? introDuration : 0;

//   return (
//     <div className="relative w-full h-full overflow-hidden bg-black">
//       <DynamicBackground
//         images={backgroundImages}
//         frame={frame}
//         durationInFrames={durationInFrames}
//       />

//       <div
//         className="relative z-20 h-full flex flex-col"
//         style={{ opacity, transform: `translateY(${translateY}px)` }}
//       >
//         <div className="flex-1 relative px-4 py-6">
//           {/* Intro sempre no começo, reportando sua duração real */}
//           <MainTitle
//             narrationSrc={staticFile("audio-intro/audio-intro.mp3")}
//             bgAudioSrc={staticFile("audio-intro/song-steven.mp3")}
//             bgVolume={0.06}
//             captions={intro}
//             onDurationComputed={setIntroDuration}
//           />

//           {/* Renderiza perguntas somente quando já sabemos onde começa (após a intro) */}
//           {introDuration > 0 &&
//             selectedQuestions.map((q, index) => {
//               const questionDuration = calculateDuration(q.question, 5);
//               const answerText = `A resposta correta é: ${q.correctAnswer}`;
//               const answerDuration = calculateDuration(answerText, 4);

//               const questionFrom = currentFrom;
//               const answerFrom = questionFrom + questionDuration;
//               currentFrom = answerFrom + answerDuration;

//               return (
//                 <>
//                   <QuestionSequence
//                     key={index}
//                     questionAudio={q.questionAudio}
//                     questionCaptions={q.captions ?? []} // garanta que existam
//                     questionFrom={questionFrom}
//                     questionDuration={questionDuration}
//                     answerAudio={q.correctAudio}
//                     answerCaptions={q.answerCaptions ?? []} // garanta que existam
//                     answerFrom={answerFrom}
//                     answerDuration={answerDuration}
//                   />

//                   <Sequence from={answerFrom} durationInFrames={answerDuration}>
//                     <div className="flex justify-between items-start mt-150 px-12">
//                       <NumberedList />
//                       <div className="text-2xl font-bold text-white">
//                         {index + 1}. {q.correctAnswer}
//                       </div>
//                     </div>
//                   </Sequence>
//                 </>
//               );
//             })}

//           <div className="flex justify-between items-start mt-150">
//             <NumberedList />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useCallback, useMemo, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
  Sequence,
  AbsoluteFill,
} from "remotion";
import { DynamicBackground } from "../../components/dynamic-background/dynamic-background";
import { MainTitle } from "../../components/main-title/main-title";
import { intro } from "../../assets/config/captions";
import questions from "../../assets/config/json";
import { QuestionSequence } from "../../components/questions/questions";
import { NumberedList } from "../../components/numbered-list/numbered-list";

export const QuizLayout01: React.FC<{ backgroundImages: string[] }> = ({
  backgroundImages,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const translateY = interpolate(frame, [0, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const selectedQuestions = useMemo(() => questions.slice(0, 10), []);

  const calculateDuration = useCallback(
    (text: string, baseSeconds = 4, charPerSecond = 15) => {
      const secs = Math.max(
        baseSeconds,
        Math.ceil(text.length / charPerSecond),
      );
      return secs * fps;
    },
    [fps],
  );

  const [introDuration, setIntroDuration] = useState(0);

  // agenda completa (quando cada pergunta/resposta inicia)
  const schedule = useMemo(() => {
    if (!introDuration) return [];
    let currentFrom = introDuration;
    return selectedQuestions.map((q, index) => {
      const questionDuration = calculateDuration(q.question, 5);
      const answerText = q.correctAnswer; // já sem letras
      const answerDuration = calculateDuration(
        `A resposta correta é: ${answerText}`,
        4,
      );

      const questionFrom = currentFrom;
      const answerFrom = questionFrom + questionDuration;
      currentFrom = answerFrom + answerDuration;

      return {
        index,
        q,
        questionFrom,
        questionDuration,
        answerFrom,
        answerDuration,
        answerText,
      };
    });
  }, [introDuration, selectedQuestions, calculateDuration]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <DynamicBackground
        images={backgroundImages}
        frame={frame}
        durationInFrames={durationInFrames}
      />

      <div
        className="relative z-20 h-full flex flex-col"
        style={{ opacity, transform: `translateY(${translateY}px)` }}
      >
        <div className="flex-1 relative px-4 py-6">
          {/* intro no início e reporta duração real */}
          <MainTitle
            narrationSrc={staticFile("audio-intro/audio-intro.mp3")}
            bgAudioSrc={staticFile("audio-intro/song-steven.mp3")}
            bgVolume={0.06}
            captions={intro}
            onDurationComputed={setIntroDuration}
          />

          {/* perguntas/respostas */}
          {schedule.map(
            ({
              index,
              q,
              questionFrom,
              questionDuration,
              answerFrom,
              answerDuration,
            }) => (
              <QuestionSequence
                key={index}
                questionAudio={q.questionAudio}
                questionCaptions={q.captions ?? []}
                questionFrom={questionFrom}
                questionDuration={questionDuration}
                answerAudio={q.correctAudio}
                answerCaptions={q.answerCaptions ?? []}
                answerFrom={answerFrom}
                answerDuration={answerDuration}
              />
            ),
          )}

          {/* rodapé persistente com lista numerada + respostas acumulando */}
          <Sequence from={0} durationInFrames={durationInFrames}>
            <AbsoluteFill className="pointer-events-none flex flex-col justify-end">
              <div className="px-12 pb-4">
                <NumberedList
                  entries={schedule.map((s) => ({
                    index: s.index,
                    answerFrom: s.answerFrom,
                    answerText: s.answerText,
                  }))}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        </div>
      </div>
    </div>
  );
};
