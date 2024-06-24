import {checkColourValue} from "@core/types";
import {defaultCheck, } from "./default-check";
import {fullCheck, } from "./full-check";
import {moduloCheck, } from "./modulo-check";
import {nullCheck,} from "./null-check";
import { realCheck} from "./real-check";

export function checkFactory(variant: string): checkColourValue {
  if (variant === 'square-square' || variant === 'circle') {
    return nullCheck();
  } else if (variant === 'generic') {
    return moduloCheck();
  } else if (variant === 'mandelbrot') {
    return moduloCheck();
  } else if (variant === 'legacy-mandelbrot' || variant === 'ochsenbrot') {
    return moduloCheck();
  } else if (variant === 'circle2') {
    return fullCheck(); // nothing
  } else if (variant === 'circle3') {
    return realCheck(); // or fullcheck also good
  } else if (variant === 'circle4') {
    return realCheck(); // no difference
  } else if (variant === 'circle5') {
    return fullCheck(); // nothing
  } else if (variant === 'circle6') {
    return realCheck(); // can do both but is also additive =(
    // full check better for negative
  }
  return defaultCheck();
}
