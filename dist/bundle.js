function sum(n1, n2) {
  return n1 + n2;
}function functionN1(number) {
  return sum(number, 0);
}function functionN2(number) {
  return sum(number, 0);
}var result = 0;
result = sum(functionN1(2), functionN2(3));
console.log(result);