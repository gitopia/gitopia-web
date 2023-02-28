import { validUserAddress, validDaoAddress } from "./validAddress";
export default function shrinkAddress(address) {
  if (validUserAddress.test(address)) {
    let trimText = address.slice(11, 42);
    if (trimText.length) {
      return address.replace("gitopia", "").replace(trimText, "...");
    }
    return address;
  } else if (validDaoAddress.test(address)) {
    let trimText = address.slice(11, 62);
    if (trimText.length) {
      return address.replace("gitopia", "").replace(trimText, "...");
    }
    return address;
  }
  return address;
}
