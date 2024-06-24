import {checkColourValue} from "../../../types";

export function defaultCheck(): checkColourValue {
  return (): number => {
    return 0;
  };
}
