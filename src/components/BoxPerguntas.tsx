import { interpolate, useCurrentFrame } from "remotion";
type BoxOPerguntasProps = {
  children: React.ReactNode;
  isCorrect?: boolean;
  hasAnimation?: boolean;
  scale?: any;
};
const BoxPerguntas = ({ children, hasAnimation }: BoxOPerguntasProps) => {
  const frame = useCurrentFrame();

  const yPosition = interpolate(frame, [0, 30], [100, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontSize: 61,
        color: "#000",
        fontFamily: "Lilita One",
        border: "2px solid #000",
        backgroundColor: "#fff",
        padding: "20px",
        margin: "40px 0px",
        borderRadius: "20px",
        boxShadow: "25px 35px 10px rgba(0, 0, 0, 1)",
        width: "691px",
        height: "256px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transform: !hasAnimation ? `translateY(${yPosition}px)` : "",
        opacity,
      }}
    >
      {children}
    </div>
  );
};

export default BoxPerguntas;
