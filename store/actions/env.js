import { starportActions, envActions } from "./actionTypes";

export const init = (config) => {
  return async (dispatch) => {
    //TODO fix actions and dispatch
    //     if (this._actions['common/starport/init']) {
    //       try {
    //         await dispatch({
    //           type: starportActions.INIT_STARPORT
    // ,
    //         });
    //         // await dispatch('common/starport/init', null, { root: true })
    //       } catch (e) {
    //         console.error(
    //           'Env:Init:Starport',
    //           'Could not initialize common/starport module'
    //         )
    //       }
    //     } else {
    try {
      await config();
    } catch (e) {
      console.error("Env:Config", "Could not configure environment");
    }
    // }
  };
};

export const setTxApi = (txapi) => {
  return {
    type: envActions.SET_TX_API,
    payload: {
      txapi,
    },
  };
};

// export const setConectivity = ({connection, status}) => {
//   return (dispatch) => {
//     dispatch({type: connection, status})
//   }
// }

export const signIn = (signer) => {
  return async (dispatch, getState) => {
    const state = getState().env;
    try {
      await state.client.useSigner(signer);
    } catch (e) {
      console.error(
        "Env:Client:Wallet",
        "Could not create signing client with signer: " + signer
      );
    }
  };
};

export const config = (
  config = {
    apiNode: "http://localhost:1317",
    rpcNode: "http://localhost:26657",
    wsNode: "ws://localhost:26657/websocket",
    chainId: "",
    addrPrefix: "",
    sdkVersion: "Stargate",
    getTXApi: "http://localhost:26657/tx?hash=0x",
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
        client.on("ws-status", (status) =>
          dispatch({ type: envActions.SET_WS_STATUS, payload: { status } })
        );
        client.on("api-status", (status) =>
          dispatch({ type: envActions.SET_API_STATUS, payload: { status } })
        );
        client.on("rpc-status", (status) =>
          dispatch({ type: envActions.SET_RPC_STATUS, payload: { status } })
        );
        console.log("config", config);
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
