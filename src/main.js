import { sum } from './sum.js'
import { functionN1 } from './n1.mjs'
import { functionN2 } from './n2.mjs'

let result = 0;

result = sum(functionN1(2),functionN2(3))

console.log(result)
