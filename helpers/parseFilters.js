export default function parseFilters(text = "") {
  const keyValueTest = /(\w+):(\w+)/g;
  const searchTest = /((?<!:)\b\w+(?!:)\b)/g;
  const pairs = [];
  for (const [fullMatch, key, value] of text.matchAll(keyValueTest)) {
    pairs.push({
      key,
      value,
    });
  }
  for (const [fullMatch] of text.matchAll(searchTest)) {
    pairs.push({
      key: "search",
      value: fullMatch,
    });
  }
  return pairs;
}
