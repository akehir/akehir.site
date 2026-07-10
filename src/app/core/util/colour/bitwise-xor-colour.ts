import { getColourValue } from '../../types';
import { checkFactory } from './check/check-factory';

export function bitwiseXorColour(
  variant: string,
  xoffset = 0,
  yoffset = 0
): getColourValue {
  const colour = checkFactory(variant);
  const sq = 2;
  const rt = 0.5;

  return (p: number, q: number, offset: number): number => {
    return colour((q - xoffset) ^ (sq + (p - yoffset)) ^ sq ^ (rt + offset));
  };
}
