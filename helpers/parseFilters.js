export default function parseFilters(text = "") {
  const keyValueTest = /(\w+):(\w+)/g;
  // const searchTest = /((?<!:)\b\w+(?!:)\b)/g;
  const pairs = [];
  let removedText = text;
  for (const [fullMatch, key, value] of text.matchAll(keyValueTest)) {
    pairs.push({
      key,
      value,
    });
    removedText = removedText.replace(fullMatch, "").trim();
  }
  // for (const [fullMatch] of text.matchAll(searchTest)) {
  //   pairs.push({
  //     key: "search",
  //     value: fullMatch,
  //   });
  // }
  if (removedText.length) {
    pairs.push({
      key: "search",
      value: removedText,
    });
  }

  return pairs;
}
