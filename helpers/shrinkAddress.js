export default function shrinkAddress(address) {
  if (typeof address === "string") {
    let trimText = address.slice(11, 42);
    if (trimText.length) {
      return address.replace("gitopia", "").replace(trimText, "...");
    }
    return address;
  }
  return "";
}
