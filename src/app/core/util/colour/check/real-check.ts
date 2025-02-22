import { checkColourValue } from '../../../types';

export function realCheck(): checkColourValue {
  const colourMax = 255;
  return (val: number): number => {
    if (val > colourMax) {
      val = 255;
    } else if (val < 0) {
      val = 0;
    }
    return Math.floor(val);
  };
}
