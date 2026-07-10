import { getColourValue } from '../../../types';
import { scaleX } from '../scale-x';
import { scaleY } from '../scale-y';
import { checkFactory } from '../check/check-factory';

export function mandelbrot(
  variant: string,
  xoffset = 0,
  yoffset = 0,
  width = 0,
  height = 0
): getColourValue {
  const colour = checkFactory(variant);
  const sq = 2;

  return (p: number, q: number): number => {
    const x0 = scaleX(p - xoffset, width);
    const y0 = scaleY(q - yoffset, height);
    let x = 0;
    let y = 0;
    let iteration = 0;
    const maxIteration = 255;
    while (x * x + y * y < sq * sq && iteration < maxIteration) {
      const xtemp = x * x - y * y + x0;
      y = sq * x * y + y0;
      x = xtemp;
      iteration += 1;
    }
    return colour(iteration);
  };
}
