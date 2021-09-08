export default function shrinkAddress(address) {
  if (address) {
    let trimText = address.slice(10, 42);
    if (trimText.length) {
      return address.replace(trimText, "...");
    }
    return address;
  }
  return "";
}
