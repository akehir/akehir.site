import {getColourValue} from "../../../types";
import {scaleX, } from "../scale-x";
import {scaleY} from "../scale-y";
import {checkFactory} from "../check/check-factory";


export function circle4(variant: string, xoffset: number= 0, yoffset: number= 0, width: number= 0, height: number= 0): getColourValue {
  const colourMax = 255;
  const colour = checkFactory(variant);
  const sq = 2;
  const rt = 0.5;
  const sizeFactor = 2;
  const locationFactor = 5;
  const ys: number = height / sizeFactor;
  const yo: number = height / locationFactor;
  const xs: number = width / sizeFactor;
  const xo: number = width / locationFactor;

  return (p: number, q: number, offset: number): number => {
    // eslint-disable-next-line max-len
    return colour(colourMax + ((scaleY(q - xoffset, height, ys, yo) ** sq + scaleX(p - yoffset, width, xs, xo) ** sq) ** rt) - offset);
  };
}
