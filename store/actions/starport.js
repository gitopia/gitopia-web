import { starportActions, envActions } from "./actionTypes";
import axios from "../../helpers/axiosFetch";
import { config } from "./env";

const apiNode =
  // (GITPOD && `${GITPOD.protocol}//1317-${GITPOD.hostname}`) ||
  // (process.env.VUE_APP_API_COSMOS &&
  // 	process.env.VUE_APP_API_COSMOS.replace('0.0.0.0', 'localhost')) ||
  "http://localhost:1317";
const rpcNode =
  // (GITPOD && `${GITPOD.protocol}//26657-${GITPOD.hostname}`) ||
  // (process.env.VUE_APP_API_TENDERMINT &&
  // 	process.env.VUE_APP_API_TENDERMINT.replace('0.0.0.0', 'localhost')) ||
  "http://localhost:26657";
const addrPrefix =
  //  process.env.VUE_APP_ADDRESS_PREFIX ||
  "gitopia";
const wsNode =
  // (GITPOD && `wss://26657-${GITPOD.hostname}/websocket`) ||
  // (process.env.VUE_APP_WS_TENDERMINT &&
  // 	process.env.VUE_APP_WS_TENDERMINT.replace('0.0.0.0', 'localhost')) ||
  "ws://localhost:26657/websocket";

export const setStatusState = async (dispatch, getState) => {
  const state = getState().starport;
  try {
    const { data } = await axios.get(`${state.starportUrl}/status`);
    const { status, env } = data;
    // console.log("Polling backend", data);

    // const GITPOD = env.vue_app_custom_url && new URL(env.vue_app_custom_url)

    const starportUrl =
      // (GITPOD && `${GITPOD.protocol}//12345-${GITPOD.hostname}`) ||
      "http://localhost:8080";

    const frontendUrl =
      // (GITPOD && `${GITPOD.protocol}//8080-${GITPOD.hostname}`) ||
      "http://localhost:8080";

    dispatch({
      type: starportActions.SET_STARPORT_ENV,
      payload: {
        starportUrl,
        frontendUrl,
      },
    });

    const chainId = env.chain_id;
    const sdkVersion = status.sdk_version;
    const apiNode =
      // (VUE_APP_API_COSMOS &&
      //   VUE_APP_API_COSMOS.replace('0.0.0.0', 'localhost')) ||
      // (GITPOD && `${GITPOD.protocol}//1317-${GITPOD.hostname}`) ||
      "http://localhost:1317";

    const rpcNode =
      // (VUE_APP_API_TENDERMINT &&
      //   VUE_APP_API_TENDERMINT.replace('0.0.0.0', 'localhost')) ||
      // (GITPOD && `${GITPOD.protocol}//26657-${GITPOD.hostname}`) ||
      "http://localhost:26657";

    const wsNode =
      // (VUE_APP_WS_TENDERMINT &&
      //   VUE_APP_WS_TENDERMINT.replace('0.0.0.0', 'localhost')) ||
      // (GITPOD && `wss://26657-${GITPOD.hostname}/websocket`) ||
      "ws://localhost:26657/websocket";

    const addrPrefix =
      // VUE_APP_ADDRESS_PREFIX ||
      "gitopia";

    const envState = getState().env;
    const getTXApi =
      envState.sdkVersion === "Stargate"
        ? dispatch({
            type: envActions.SET_TX_API,
            payload: { txapi: envState.sdkVersion + "/tx?hash=0x" },
          })
        : dispatch({
            type: envActions.SET_TX_API,
            payload: { txapi: envState.apiCosmos + "/txs/" },
          });

    dispatch({
      type: envActions.SET_CONFIG,
      payload: {
        config: {
          chainId,
          sdkVersion,
          apiNode,
          rpcNode,
          wsNode,
          addrPrefix,
          getTXApi,
        },
      },
    });

    dispatch({
      type: starportActions.SET_BACKEND_RUNNING_STATES,
      payload: {
        frontend: status.is_my_app_frontend_alive,
        rpc: status.is_consensus_engine_alive,
        api: status.is_my_app_backend_alive,
      },
    });

    dispatch({
      type: starportActions.SET_BACKEND_ENV,
      payload: {
        node_js: env.node_js,
        vue_app_custom_url: env.vue_app_custom_url,
      },
    });

    /**
       *
       // If backend was down, but alive now,
       // it indicates the app is restarting.
       // Forcing browser to reload in this case to reset blockchain data.
       *
       */
    // if (getters.wasAppRestarted(status)) {
    //   window.location.reload(false)
    // }
    dispatch({
      type: starportActions.SET_PREV_STATES,
      payload: {
        status,
      },
    });
  } catch (error) {
    dispatch({
      type: starportActions.SET_BACKEND_RUNNING_STATES,
      payload: {
        frontend: false,
        rpc: false,
        api: false,
      },
    });

    dispatch({
      type: starportActions.SET_PREV_STATES,
      payload: {
        status: null,
      },
    });

    console.error(
      "Starport:Status",
      "Could not set status from starport",
      error
    );
  }
};

export const startStarportPolling = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: starportActions.SET_TIMER,
      payload: {
        timer: setInterval(async () => {
          try {
            await setStatusState(dispatch, getState);
          } catch (e) {
            console.error(e);
          }
        }, 5000),
      },
    });
    await config({
      apiNode,
      rpcNode,
      wsNode,
      addrPrefix,
    });
    // console.log("config set", {
    //   apiNode,
    //   rpcNode,
    //   wsNode,
    //   addrPrefix,
    // });
    // await setStatusState(dispatch, getState);
  };
};

export const stopStarportPolling = () => {
  return (dispatch) => {
    dispatch({ type: starportActions.CLEAR_TIMER });
  };
};
