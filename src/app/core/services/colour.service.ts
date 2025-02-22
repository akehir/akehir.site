import { Injectable } from '@angular/core';
import { getColourValue } from '../types';
import { bitwiseXorColour } from '../util/colour/bitwise-xor-colour';
import { mandelbrot } from '../util/colour/pixel-factory/mandelbrot';
import { legacymandelbrot } from '../util/colour/pixel-factory/legacy-mandelbrot';
import { ochsenbrot } from '../util/colour/pixel-factory/ochsenbrot';
import { circle } from '../util/colour/pixel-factory/circle';
import { circle2 } from '../util/colour/pixel-factory/circle-2';
import { circle3 } from '../util/colour/pixel-factory/circle-3';
import { circle4 } from '../util/colour/pixel-factory/circle-4';
import { circle5 } from '../util/colour/pixel-factory/circle-5';
import { circle6 } from '../util/colour/pixel-factory/circle-6';
import { simplecircle } from '../util/colour/pixel-factory/circle-simple';
import { random } from '../util/colour/pixel-factory/random';

@Injectable()
export class ColourService {
  pixelFactory(
    variant: string,
    xoffset: number = 0,
    yoffset: number = 0,
    width: number = 0,
    height: number = 0
  ): getColourValue {
    if (variant === 'square-square') {
      return bitwiseXorColour(variant, xoffset, yoffset);
    } else if (variant === 'generic') {
      return bitwiseXorColour(variant, xoffset, yoffset);
    } else if (variant === 'mandelbrot') {
      return mandelbrot(variant, xoffset, yoffset, width, height);
    } else if (variant === 'legacy-mandelbrot') {
      return legacymandelbrot(variant, xoffset, yoffset, width, height);
    } else if (variant === 'ochsenbrot') {
      return ochsenbrot(variant, xoffset, yoffset, width, height);
    } else if (variant === 'triangle') {
      // TODO: Implement and import
    } else if (variant === 'circle') {
      return circle(variant, xoffset, yoffset, width, height);
    } else if (variant === 'circle2') {
      return circle2(variant, xoffset, yoffset, width, height);
    } else if (variant === 'circle3') {
      return circle3(variant, xoffset, yoffset, width, height);
    } else if (variant === 'circle4') {
      return circle4(variant, xoffset, yoffset, width, height);
    } else if (variant === 'circle5') {
      return circle5(variant, xoffset, yoffset, width, height);
    } else if (variant === 'circle6') {
      return circle6(variant, xoffset, yoffset, width, height);
    } else if (variant === 'circle-simple-algorithm') {
      return simplecircle(variant, xoffset, yoffset);
    }
    return random();
  }
}
