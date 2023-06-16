import axios from "../helpers/axiosFetch";
import { get, set, del } from "../store/persist";

function saveWorkingEndpoint(url) {
  let workingEndpoints = get("workingEndpoints") || [];
  if (url) {
    workingEndpoints.push(url);
    set("workingEndpoints", workingEndpoints);
  }
}

function deleteWorkingEndpoint(url) {
  let workingEndpoints = get("workingEndpoints") || [];
  let index = workingEndpoints.indexOf(url);
  if (index > -1) {
    workingEndpoints.splice(index, 1);
    set("workingEndpoints", workingEndpoints);
  }
}

function checkSavedEndpoint(endpoints) {
  let workingEndpoints = get("workingEndpoints") || [];
  for (let i = 0; i < endpoints.length; i++) {
    if (workingEndpoints.includes(endpoints[i].address)) {
      return endpoints[i].address;
    }
  }
  return null;
}

export async function getEndpoint(type, endpoints, address = null) {
  if (type === "rpc") {
    let earlierEndpoint = checkSavedEndpoint(endpoints);
    if (earlierEndpoint) {
      try {
        const res = await axios.get(earlierEndpoint);
        if (res.status === 200) {
          return earlierEndpoint;
        }
      } catch (e) {
        console.log("earlier saved rpc endpoint not working");
        deleteWorkingEndpoint(earlierEndpoint);
      }
    }
    for (let i = 0; i < endpoints.length; i++) {
      const baseUrl = endpoints[i].address;
      try {
        const res = await axios.get(baseUrl);
        if (res.status === 200) {
          saveWorkingEndpoint(baseUrl);
          return baseUrl;
        }
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  } else if (type === "rest") {
    let earlierEndpoint = checkSavedEndpoint(endpoints);
    if (earlierEndpoint) {
      try {
        const res = await axios.get(
          earlierEndpoint + "/cosmos/bank/v1beta1/balances/" + address
        );
        if (res.status === 200) {
          return earlierEndpoint;
        }
      } catch (e) {
        console.log("earlier saved rest endpoint not working");
        deleteWorkingEndpoint(earlierEndpoint);
      }
    }
    for (let i = 0; i < endpoints.length; i++) {
      const baseUrl =
        endpoints[i].address + "/cosmos/bank/v1beta1/balances/" + address;
      try {
        const res = await axios.get(baseUrl);
        if (res.status === 200) {
          saveWorkingEndpoint(endpoints[i].address);
          return endpoints[i].address;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  return null;
}
