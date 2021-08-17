import { assertIsBroadcastTxSuccess } from "@cosmjs/stargate";
import { notify } from "reapop";
import { sendTransaction } from "./env";
import { createUser, getUserDetailsForSelectedAddress } from "./user";
import { reInitClients } from "./wallet";
import { validatePostingEligibility } from "./repository";

export const createOrganization = ({ name = null, description = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "organization")))
      return null;
    const organization = {
      creator: wallet.selectedAddress,
      name: name,
      description: description,
    };

    try {
      const message = await env.txClient.msgCreateOrganization(organization);
      const result = await sendTransaction({ message }, env);
      console.log(result);
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress()(dispatch, getState);
        return { url: "/home" };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
      return null;
    }
  };
};
