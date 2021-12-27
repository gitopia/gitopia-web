import Client from "@starport/client-js";
import { envActions } from "./actionTypes";
import { assertIsBroadcastTxSuccess } from "@cosmjs/stargate";
import { notify } from "reapop";

export const init = (initConfig) => {
  return async (dispatch, getState) => {
    try {
      config(initConfig)(dispatch, getState);
    } catch (e) {
      console.error("Env:Config", "Could not configure environment", e);
    }
  };
};

export const config = (
  config = {
    apiNode: process.env.NEXT_PUBLIC_API_URL,
    rpcNode: process.env.NEXT_PUBLIC_RPC_URL,
    wsNode: process.env.NEXT_PUBLIC_WS_URL,
    chainId: "",
    addrPrefix: "",
    sdkVersion: "Stargate",
    getTXApi: process.env.NEXT_PUBLIC_API_URL + "/tx?hash=0x",
  }
) => {
  return async (dispatch, getState) => {
    const state = getState().env;
    try {
      let client;
      if (!state.client) {
        client = new Client({
          apiAddr: config.apiNode,
          rpcAddr: config.rpcNode,
          wsAddr: config.wsNode,
        });
        client.on("ws-status", (status) => {
          dispatch({ type: envActions.SET_WS_STATUS, payload: { status } });
        });
        client.on("api-status", (status) => {
          dispatch({ type: envActions.SET_API_STATUS, payload: { status } });
        });
        client.on("rpc-status", (status) => {
          dispatch({ type: envActions.SET_RPC_STATUS, payload: { status } });
        });
        dispatch({ type: envActions.SET_CONFIG, payload: { config } });
        dispatch({ type: envActions.CONNECT, payload: { client } });
        dispatch({ type: envActions.INITIALIZE_WS_COMPLETE });
      } else {
        client = state.client;
        let reconnectWS = false;
        let reconnectSigningClient = false;
        let reconnectClient = false;
        if (config.wsNode != state.wsNode) {
          reconnectWS = true;
        }
        if (config.rpcNode != state.rpcNode) {
          reconnectSigningClient = true;
        }
        if (config.apiNode != state.apiNode) {
          reconnectClient = true;
        }
        dispatch({ type: envActions.SET_CONFIG, payload: { config } });

        if (reconnectWS && config.wsNode) {
          try {
            await client.switchWS(config.wsNode);
          } catch (e) {
            console.error(
              "Env:Client:Websocket",
              "Could not switch to websocket node:" + config.wsNode
            );
          }
        }
        if (reconnectClient && config.apiNode) {
          client.switchAPI(config.apiNode);
        }
        if (reconnectSigningClient && config.rpcNode) {
          try {
            await client.switchRPC(config.rpcNode);
          } catch (e) {
            console.error(
              "Env:Client:TendermintRPC",
              "Could not switch to Tendermint RPC node:" + config.rpcNode
            );
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
};

export const sendTransaction = async (
  { message, memo, denom = process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN },
  env
) => {
  const fee = {
    amount: [{ amount: "0", denom }],
    gas: "200000",
  };
  const result = await env.txClient.signAndBroadcast([message], {
    fee,
    memo,
  });
  return result;
};
