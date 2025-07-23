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

  const length = children?.length;

  const height = length > 60 ? "320px" : "260px";
  const fontSize = length > 60 ? 45 : 61;
  const padding = length > 60 ? "24px" : "20px";

  console.log(length, "Retorno de length");
  return (
    <div
      style={{
        fontSize,
        color: "#000",
        fontFamily: "Lilita One",
        border: "2px solid #000",
        backgroundColor: "#fff",
        padding,
        margin: "40px 0px",
        borderRadius: "20px",
        boxShadow: "25px 35px 10px rgba(0, 0, 0, 1)",
        width: "691px",
        height,
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
