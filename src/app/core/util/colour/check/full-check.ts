import { checkColourValue } from '../../../types';

export function fullCheck(): checkColourValue {
  const colourMax = 255;
  return (val: number): number => {
    if (val > colourMax || val < 0) {
      val = 255;
    }
    return Math.floor(val);
  };
}
