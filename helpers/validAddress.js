const validAddress = new RegExp("^gitopia(([a-z0-9]{39})$|([a-z0-9]{59})$)");
const validUserAddress = new RegExp("^gitopia([a-z0-9]{39})$");
const validDaoAddress = new RegExp("^gitopia([a-z0-9]{59})$");
export default validAddress;
export { validAddress, validUserAddress, validDaoAddress };
