import { getColourValue } from '../../../types';
import { scaleX } from '../scale-x';
import { scaleY } from '../scale-y';
import { checkFactory } from '../check/check-factory';

export function legacymandelbrot(
  variant: string,
  xoffset: number = 0,
  yoffset: number = 0,
  width: number = 0,
  height: number = 0
): getColourValue {
  const colourMax = 255;
  const colour = checkFactory(variant);
  const sq = 2;
  const it = 25; // Iterationen
  const s = 5; // Genauigkeit
  let xinitial = 0; // Additive Konstante (xinitial=realteil von c)
  let yinitial = 0; // Additive Konstante (yinitial=imaginärteil von c)

  return (p: number, q: number): number => {
    xinitial = scaleX(p - xoffset, width);
    yinitial = scaleY(q - yoffset, height);
    let nn = 0; // gezeichnete Iterationen
    let zxr = 0; // Reeller Teil von z (Array für Temporär)
    let zyr = 0;
    let zxi = 0; // Imaginärer Teil von z
    let zyi = 0;

    // zxr * zxr + zyr * zyr < sq*sq
    while (nn < it && zyr < s && zxr < s) {
      zxi = zxr * zxr - zyr * zyr + xinitial;
      zyi = sq * zxr * zyr + yinitial;
      zxr = zxi;
      zyr = zyi;
      nn += 1;
    }
    return colour(Math.floor(nn * (colourMax / it)));
  };
}
