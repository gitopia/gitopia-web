import { assertIsBroadcastTxSuccess } from "@cosmjs/stargate";
import { notify } from "reapop";
import { sendTransaction } from "./env";
import {
  createUser,
  getUserDetailsForSelectedAddress,
  setCurrentDashboard,
} from "./user";
import { userActions, organizationActions } from "./actionTypes";
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
        await getUserDetailsForSelectedAddress()(dispatch, getState);
        dispatch({
          type: userActions.INIT_DASHBOARDS,
          payload: {
            name: wallet.activeWallet.name,
            id: wallet.selectedAddress,
          },
        });
        setCurrentDashboard(wallet.selectedAddress)(dispatch, getState);
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

export const getOrganizationDetailsForDashboard = () => {
  return async (dispatch, getState) => {
    const { env, user } = getState();
    try {
      const result = await env.queryClient.queryOrganization(
        user.currentDashboard
      );
      console.log(result);
      dispatch({
        type: organizationActions.SET_ORGANIZATION,
        payload: { organization: result.data.Organization },
      });
    } catch (e) {
      dispatch({
        type: organizationActions.SET_EMPTY_ORGANIZATION,
      });
    }
  };
};
