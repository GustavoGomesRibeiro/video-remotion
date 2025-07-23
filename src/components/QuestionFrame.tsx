import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  Video,
} from "remotion";
import { motion } from "framer-motion";
import BoxPerguntas from "./BoxPerguntas";
import BoxOpcoes from "./BoxOpcoes";
import { settings } from "../assets/config/setting";

export const QuestionFrame = ({ question, options, background }) => {
  const frame = useCurrentFrame();
  const yPosition = interpolate(frame, [0, 30], [100, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
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
          gap: "40px",
        }}
      >
        <motion.div
          style={{
            fontSize: 80,
            color: "#fff",
            fontFamily: "Lilita One",
            textShadow: "rgb(0, 0, 0) 10px 10px 0px",
            textAlign: "center",
            transform: `translateY(${yPosition}px)`,
            opacity,
          }}
        >
          {settings.titulo}
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <BoxPerguntas>{question}</BoxPerguntas>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {options.map((option, index) => (
              <BoxOpcoes key={index}>{option}</BoxOpcoes>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: 71,
            color: "#fff",
            fontFamily: "Lilita One",
            textShadow: "rgb(0, 0, 0) 10px 10px 0px",
            textAlign: "center",
          }}
        >
          @quiznatelabr
        </div>
      </div>
    </AbsoluteFill>
  );
};
