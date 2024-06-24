import {checkColourValue} from "../../../types";

export function nullCheck(): checkColourValue {
  const colourMax = 255;
  return (val: number): number => {
    if (val > colourMax || val < 0) {
      val = 0;
    }
    return Math.floor(val);
  };
}
