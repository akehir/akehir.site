import {getColourValue} from "../../../types";
import {checkFactory} from "../check/check-factory";


export function simplecircle(variant: string, xoffset: number= 0, yoffset: number= 0): getColourValue {
  const colour = checkFactory(variant);
  const colourMax = 255;
  const sq = 2;
  const rt = 0.25;

  return (p: number, q: number, offset: number): number => {
    return colour(((q - xoffset) ** sq + (p - yoffset) ** sq) ** rt + colourMax - offset);
  };
}
