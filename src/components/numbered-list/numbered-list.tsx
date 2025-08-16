import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const NumberedList: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div className="flex flex-col gap-3">
      {[...Array(10)].map((_, index) => {
        const delay = index * 5;
        const opacity = interpolate(frame, [30 + delay, 50 + delay], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const translateX = interpolate(
          frame,
          [30 + delay, 50 + delay],
          [-20, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        return (
          <div
            key={index}
            className="flex items-center"
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
            }}
          >
            <div className="w-24 h-24 bg-black bg-opacity-60 rounded-lg flex items-center justify-center border-2 border-white border-opacity-30">
              <span
                className="text-white text-2xl font-bold"
                style={{
                  fontFamily: "Lilita One",
                  fontSize: 65,
                }}
              >
                {index + 1}
                {index === 9 && "."}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
