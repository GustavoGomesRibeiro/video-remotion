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
import { Intro } from "./components/Intro";
import { QuizLayout01 } from "./compositions/quiz-layout-01/quiz-layout-01";

const QuizVideo: React.FC<{ startIndex: number; endIndex: number }> = ({
  startIndex,
  endIndex,
}) => {
  const { fps } = useVideoConfig();
  const selectedQuestions = questions.slice(startIndex, endIndex);

  const tema = settings.titulo.replace("Quiz ", "");
  const dificuldade = settings.dificuldade ?? "médio";
  const introDurationInFrames = 220;

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

  let currentFrom = introDurationInFrames;

  return (
    <>
      <Audio src={staticFile("song-steven.mp3")} volume={0.05} />

      <Sequence from={0} durationInFrames={introDurationInFrames}>
        <Intro
          background={"intro/background-introducao-01.jpg"}
          text1={`Quiz de ${tema}`}
          text2={`Consegue acertar 5 de 5 perguntas na dificuldade ${dificuldade}`}
          text3={`Vamos lá!`}
          audioSrc="/audio-intro.mp3"
        />
      </Sequence>

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
  const introDurationInFrames = 220;
  const totalDuration = (startIndex: number, endIndex: number) =>
    introDurationInFrames +
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

      <Composition
        id="QuizLayout01"
        component={QuizLayout01}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          backgroundImages: [
            staticFile("images/earth.jpeg"),
            staticFile("images/globe.jpeg"),
            staticFile("images/hurricane.jpeg"),
          ],
        }}
      />
    </>
  );
};
