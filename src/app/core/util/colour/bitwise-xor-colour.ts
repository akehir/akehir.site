import {getColourValue} from "../../types";

export function bitwiseXorColour(variant: string, xoffset: number= 0, yoffset: number= 0): getColourValue {
  const colour = this.checkFactory(variant);
  const sq = 2;
  const rt = 0.5;

  return (p: number, q: number, offset: number): number => {
    // eslint-disable-next-line no-bitwise
    return colour(((q - xoffset) ^ sq + (p - yoffset) ^ sq) ^ (rt) + offset);
  };
}
