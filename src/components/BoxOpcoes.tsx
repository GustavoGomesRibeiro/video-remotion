import { interpolate, useCurrentFrame } from "remotion";

type BoxOpcoesProps = {
  children: React.ReactNode;
  isCorrect?: boolean;
  hasAnimation?: boolean;
  scale?: any;
};

const BoxOpcoes = ({
  children,
  isCorrect,
  hasAnimation,
  scale,
}: BoxOpcoesProps) => {
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
        fontSize: 51,
        color: "#000",
        border: "2px solid #000",
        fontFamily: "Lilita One",
        backgroundColor: isCorrect ? "#7ED957" : "#F7F2E5",
        padding: "20px",
        margin: "40px 0px",
        borderRadius: "20px",
        boxShadow: "25px 35px 10px rgba(0, 0, 0, 1)",
        width: "691px",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transform: hasAnimation
          ? `scale(${scale})`
          : `translateY(${yPosition}px)`,
        transition: hasAnimation ? "transform 0.1s ease-in-out" : "",
        opacity,
      }}
    >
      {children}
    </div>
  );
};

export default BoxOpcoes;
