import { checkColourValue } from '@core/types';

export function moduloCheck(): checkColourValue {
  const colourMax = 255;
  return (val: number): number => {
    return val % colourMax;
  };
}
