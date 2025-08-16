import React from "react";
import { interpolate, Img, staticFile } from "remotion";

interface DynamicBackgroundProps {
  images: string[];
  frame: number;
  durationInFrames: number;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  images,
  frame,
  durationInFrames,
}) => {
  const imageIndex = Math.floor(
    interpolate(frame, [0, durationInFrames], [0, images.length - 0.001]),
  );

  const scale = interpolate(frame, [0, durationInFrames], [1, 1.1]);

  const currentImage = images[Math.min(imageIndex, images.length - 1)];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="w-full h-full transition-transform duration-1000"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={currentImage}
          // src={staticFile("images/earth.jpeg")}
          style={{
            filter: "brightness(0.7) saturate(1.2)",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${interpolate(frame, [0, 150], [1, 1.2], {
              extrapolateRight: "clamp",
            })})`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>
    </div>
  );
};
