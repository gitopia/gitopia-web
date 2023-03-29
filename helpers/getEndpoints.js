import axios from "axios";

export async function getEndpoint(type, endpoints, address = null) {
  if (type === "rpc") {
    for (let i = 0; i < endpoints.length; i++) {
      const baseUrl = endpoints[i].address;
      try {
        const res = await axios.get(baseUrl);
        if (res.status === 200) {
          return baseUrl;
        }
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  } else if (type === "rest") {
    for (let i = 0; i < endpoints.length; i++) {
      const baseUrl =
        endpoints[i].address + "/cosmos/bank/v1beta1/balances/" + address;
      try {
        const res = await axios.get(baseUrl);
        if (res.status === 200) {
          return endpoints[i].address;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  return null;
}
