export default function shrinkSha(address) {
  if (typeof address === "string") {
    let trimText = address.slice(4, 60);
    if (trimText.length) {
      return address.replace(trimText, "...");
    }
    return address;
  }
  return "";
}
