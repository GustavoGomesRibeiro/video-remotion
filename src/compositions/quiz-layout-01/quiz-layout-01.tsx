import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from "remotion";
import { DynamicBackground } from "../../components/dynamic-background/dynamic-background";
import { NumberedList } from "../../components/numbered-list/numbered-list";
import { MainTitle } from "../../components/main-title/main-title";
import introCaptions from "../../assets/config/captions.json";

interface QuizLayoutProps {
  backgroundImages: string[];
  quizTitle: string;
  description: string;
}

export const QuizLayout01: React.FC<QuizLayoutProps> = ({
  backgroundImages,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

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
          {/* Agora o título toca o áudio e mostra legendas */}
          <MainTitle
            narrationSrc={staticFile("audio-intro/audio-intro.mp3")}
            bgAudioSrc={staticFile("audio-intro/song-steven.mp3")}
            bgVolume={0.06}
            captions={introCaptions}
          />

          <div className="flex justify-between items-start mt-8">
            <NumberedList />
          </div>
        </div>
      </div>
    </div>
  );
};
