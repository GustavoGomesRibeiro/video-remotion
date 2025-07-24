import React from "react";
import "./fonts/fonts.css";
import {
  Composition,
  Audio,
  Sequence,
  useVideoConfig,
  staticFile,
} from "remotion";
import { QuestionFrame } from "./components/QuestionFrame";
import { AnswerFrame } from "./components/AnswerFrame";
import { settings } from "./assets/config/setting";
import questions from "./assets/config/json";

// const QuizVideo = () => {
//   const { fps } = useVideoConfig();

//   // 🧠 Função genérica para calcular duração baseada em caracteres
//   const calculateDuration = (
//     text: string,
//     baseSeconds = 4,
//     charPerSecond = 15,
//   ) => {
//     const durationInSeconds = Math.max(
//       baseSeconds,
//       Math.ceil(text.length / charPerSecond),
//     );
//     return durationInSeconds * fps;
//   };

//   let currentFrom = 0;

//   return (
//     <>
//       {questions.map((question, index) => {
//         const questionDuration = calculateDuration(question.question, 5); // mínimo 5s
//         const answerText = `A resposta correta é: ${question.correctAnswer}`;
//         const answerDuration = calculateDuration(answerText, 4); // mínimo 4s

//         const questionFrom = currentFrom;
//         const answerFrom = questionFrom + questionDuration;
//         currentFrom = answerFrom + answerDuration;

//         return (
//           <React.Fragment key={index}>
//             <Sequence from={questionFrom} durationInFrames={questionDuration}>
//               <QuestionFrame
//                 question={question.question}
//                 options={question.options}
//                 background={settings.background}
//               />
//               <Audio src={staticFile(question.questionAudio)} />
//               <Audio src={staticFile(settings.timerAudio)} />
//             </Sequence>

//             <Sequence from={answerFrom} durationInFrames={answerDuration}>
//               <AnswerFrame
//                 question={question.question}
//                 options={question.options}
//                 correctAnswer={question.correctAnswer}
//                 background={settings.background}
//               />
//               <Audio src={staticFile(settings.answerAudio)} />
//               <Audio src={staticFile(question.correctAudio)} />
//             </Sequence>
//           </React.Fragment>
//         );
//       })}
//     </>
//   );
// };

// export const Root = () => {
//   const totalFrames = questions.reduce((acc, q) => {
//     const questionFrames = Math.max(5, Math.ceil(q.question.length / 15)) * 30;
//     const answerText = `A resposta correta é: ${q.correctAnswer}`;
//     const answerFrames = Math.max(4, Math.ceil(answerText.length / 15)) * 30;
//     return acc + questionFrames + answerFrames;
//   }, 0);

//   return (
//     <Composition
//       id="QuizVideo"
//       component={QuizVideo}
//       durationInFrames={totalFrames}
//       fps={30}
//       width={1080}
//       height={1920}
//     />
//   );
// };
const QuizVideo: React.FC<{ startIndex: number; endIndex: number }> = ({
  startIndex,
  endIndex,
}) => {
  const { fps } = useVideoConfig();
  const selectedQuestions = questions.slice(startIndex, endIndex);

  const calculateDuration = (
    text: string,
    baseSeconds = 4,
    charPerSecond = 15,
  ) => {
    const durationInSeconds = Math.max(
      baseSeconds,
      Math.ceil(text.length / charPerSecond),
    );
    return durationInSeconds * fps;
  };

  let currentFrom = 0;

  return (
    <>
      {selectedQuestions.map((question, index) => {
        const questionDuration = calculateDuration(question.question, 5);
        const answerText = `A resposta correta é: ${question.correctAnswer}`;
        const answerDuration = calculateDuration(answerText, 4);

        const questionFrom = currentFrom;
        const answerFrom = questionFrom + questionDuration;
        currentFrom = answerFrom + answerDuration;

        return (
          <React.Fragment key={index}>
            <Sequence from={questionFrom} durationInFrames={questionDuration}>
              <QuestionFrame
                question={question.question}
                options={question.options}
                background={settings.background}
              />
              <Audio src={question.questionAudio} />
              <Audio src={staticFile(settings.timerAudio)} />
            </Sequence>

            <Sequence from={answerFrom} durationInFrames={answerDuration}>
              <AnswerFrame
                question={question.question}
                options={question.options}
                correctAnswer={question.correctAnswer}
                background={settings.background}
              />
              <Audio src={staticFile(settings.answerAudio)} />
              <Audio src={question.correctAudio} />
            </Sequence>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Root = () => {
  const totalDuration = (startIndex: number, endIndex: number) =>
    questions.slice(startIndex, endIndex).reduce((acc, q) => {
      const questionFrames =
        Math.max(5, Math.ceil(q.question.length / 15)) * 30;
      const answerText = `A resposta correta é: ${q.correctAnswer}`;
      const answerFrames = Math.max(4, Math.ceil(answerText.length / 15)) * 30;
      return acc + questionFrames + answerFrames;
    }, 0);

  return (
    <>
      <Composition
        id="QuizParte1"
        component={QuizVideo}
        durationInFrames={totalDuration(0, 5)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ startIndex: 0, endIndex: 5 }}
      />
      <Composition
        id="QuizParte2"
        component={QuizVideo}
        durationInFrames={totalDuration(5, 10)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ startIndex: 5, endIndex: 10 }}
      />
    </>
  );
};
