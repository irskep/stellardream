export default function weightedRandom<T>(weights: Array<[T, number]>, normalizedValue: number): T {
  let sumOfWeights = 0;
  for (let item of weights) {
    sumOfWeights += item[1];
  }

  const randomValue: number = normalizedValue * sumOfWeights;
 
  let sumSoFar = 0;
  for (let [value, weight] of weights) {
    sumSoFar += weight;
    if (randomValue <= sumSoFar) {
      return value;
    }
  }

  throw new Error("Choice error: " + randomValue);
}