import { Audio, staticFile, useCurrentFrame, Video, Img } from "remotion";
import { interpolate } from "remotion";
import BoxOpcoes from "./BoxOpcoes";

type IntroProps = {
  background: string;
  text1: string;
  text2: string;
  text3: string;
  audioSrc: string;
};

export const Intro: React.FC<IntroProps> = ({
  background,
  text1,
  text2,
  text3,
  audioSrc,
}) => {
  const frame = useCurrentFrame();

  const texto1Start = 0;
  const texto1End = texto1Start + 79;
  const texto2Start = texto1End + 15;
  const texto2End = texto2Start + 60;
  const texto3Start = texto2End + 15;
  const texto3End = texto3Start + 60;

  const showText1 = frame >= texto1Start && frame <= texto1End;
  const showText2 = frame >= texto2Start && frame <= texto2End;
  const showText3 = frame >= texto3Start && frame <= texto3End;

  const opacity = (start: number, end: number) =>
    interpolate(frame, [start, start + 10, end - 10, end], [0, 1, 1, 0], {
      extrapolateRight: "clamp",
    });

  return (
    <>
      {background.endsWith(".mp4") ? (
        <Video src={staticFile(background)} />
      ) : (
        <Img
          src={staticFile(background)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${interpolate(frame, [0, 150], [1, 1.2], {
              extrapolateRight: "clamp",
            })})`,
            transition: "transform 0.3s ease-out",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: "30%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {showText1 && (
          <div style={{ opacity: opacity(texto1Start, texto1End) }}>
            <BoxOpcoes>{text1}</BoxOpcoes>
          </div>
        )}
        {showText2 && (
          <div style={{ opacity: opacity(texto2Start, texto2End) }}>
            <BoxOpcoes showIcon={false}>{text2}</BoxOpcoes>
          </div>
        )}
        {showText3 && (
          <div style={{ opacity: opacity(texto3Start, texto3End) }}>
            <BoxOpcoes showIcon={false}>{text3}</BoxOpcoes>
          </div>
        )}
      </div>

      <Audio src={staticFile(audioSrc)} />
    </>
  );
};
