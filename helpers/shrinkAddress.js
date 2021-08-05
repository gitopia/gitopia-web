export default function shrinkAddress(address) {
  if (address) {
    let trimText = address.slice(10, 42);
    return address.replace(trimText, "...");
  }
  return "";
}
