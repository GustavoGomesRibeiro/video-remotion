import React from "react";
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

const QuizVideo = () => {
  const { fps } = useVideoConfig();
  const questionDuration = 5 * fps; // 5 segundos
  const answerDuration = 4 * fps; // 4 segundos

  return (
    <>
      {questions.map((question, index) => (
        <React.Fragment key={index}>
          <Sequence
            from={index * (questionDuration + answerDuration)}
            durationInFrames={questionDuration}
          >
            <QuestionFrame
              question={question.question}
              options={question.options}
              background={settings.background}
            />
            <Audio src={staticFile(question.questionAudio)} />
            <Audio src={staticFile(settings.timerAudio)} />
          </Sequence>

          <Sequence
            from={
              index * (questionDuration + answerDuration) + questionDuration
            }
            durationInFrames={answerDuration}
          >
            <AnswerFrame
              question={question.question}
              options={question.options}
              correctAnswer={question.correctAnswer}
              background={settings.background}
            />
            <Audio src={staticFile(settings.answerAudio)} />
            <Audio src={staticFile(question.correctAudio)} />
          </Sequence>
        </React.Fragment>
      ))}
    </>
  );
};

// Defina a Composition
export const Root = () => {
  const totalDuration = questions.length * (5 + 4); // 5s (pergunta) + 4s (resposta) por questão

  return (
    <Composition
      id="QuizVideo"
      component={QuizVideo}
      durationInFrames={totalDuration * 30} // 30 FPS
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
