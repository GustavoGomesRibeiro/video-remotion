// src/components/AnswerFrame.tsx
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  Video,
} from "remotion";
import BoxPerguntas from "./BoxPerguntas";
import BoxOpcoes from "./BoxOpcoes";
import { settings } from "../assets/config/setting";

export const AnswerFrame = ({
  question,
  options,
  correctAnswer,
  background,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {/* Background */}
      <Video
        src={staticFile(background)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px", // Espaçamento entre os elementos
        }}
      >
        {/* Título "Quiz Conhecimentos Gerais" */}
        <div
          style={{
            fontSize: 80,
            color: "#fff",
            fontFamily: "Lilita One",
            textShadow: "rgb(0, 0, 0) 10px 10px 0px",
            textAlign: "center",
          }}
        >
          {settings.titulo}
        </div>

        <BoxPerguntas hasAnimation>{question}</BoxPerguntas>

        {/* Opções */}
        {options.map((option, index) => {
          // Verifica se a opção é a resposta correta
          const isCorrect = option === correctAnswer;

          // Animação de pulse para a resposta correta
          const scale = isCorrect
            ? interpolate(frame, [0, 40, 80, 120], [1, 1.1, 0.9, 1], {
                extrapolateRight: "clamp",
              })
            : 1;

          return (
            <BoxOpcoes
              key={index}
              isCorrect={isCorrect}
              hasAnimation
              scale={scale}
            >
              {option}
            </BoxOpcoes>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
