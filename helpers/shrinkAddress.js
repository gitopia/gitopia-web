const validAddress = new RegExp("gitopia[a-z0-9]{39}");
export default function shrinkAddress(address) {
  if (validAddress.test(address)) {
    let trimText = address.slice(11, 42);
    if (trimText.length) {
      return address.replace("gitopia", "").replace(trimText, "...");
    }
    return address;
  }
  return address;
}
