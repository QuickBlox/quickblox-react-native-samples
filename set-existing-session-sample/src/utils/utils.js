export const generateColor = (str) => {
  const color = (str) => {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }
  return `hsl(${color(str) % 360}, 100%, 50%)`;
}

export const differenceBetweenSets = (setA, setB) => {
  return new Set(
    [...setA].filter(element => !setB.has(element))
  );
}
