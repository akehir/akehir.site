import {getColourValue} from "@core/types";

export function  random(): getColourValue {
  const sq = 2;
  const rt = 0.5;
  const colourMax = 255;

  const channelStrength = colourMax / (sq + rt);
  return (): number => {
    return (Math.floor(Math.random() * channelStrength));
  };
}
