import {functionN1} from "./n1.mjs"
import {functionN2} from "./n2.mjs"

export function sum(n1, n2) {
  n1 = functionN1(n1, 0);
  n2 = functionN2(n2, 0);
  return n1 + n2;
}

