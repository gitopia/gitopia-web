import { envActions } from "../actions/actionTypes";

const initialState = {
  chainId: null,
  addrPrefix: "",
  sdkVersion: "Stargate",
  apiNode: process.env.NEXT_PUBLIC_API_URL,
  rpcNode: process.env.NEXT_PUBLIC_RPC_URL,
  wsNode: process.env.NEXT_PUBLIC_WS_URL,
  client: null,
  apiConnected: false,
  rpcConnected: false,
  wsConnected: false,
  getTXApi: process.env.NEXT_PUBLIC_API_URL + "/tx?hash=0x",
  initialized: false,
  txClient: null,
  queryClient: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case envActions.SET_CONFIG: {
      const { config } = action.payload;
      state.apiNode = config.apiNode;
      if (config.rpcNode) {
        state.rpcNode = config.rpcNode;
      }
      if (config.wsNode) {
        state.wsNode = config.wsNode;
      }
      if (config.chainId) {
        state.chainId = config.chainId;
      }
      if (config.addrPrefix) {
        state.addrPrefix = config.addrPrefix;
      }
      if (config.sdkVersion) {
        state.sdkVersion = config.sdkVersion;
      }
      if (config.getTXApi) {
        state.getTXApi = config.getTXApi;
      }
      return {
        ...state,
      };
    }

    case envActions.CONNECT: {
      const { client } = action.payload;
      return {
        ...state,
        client,
      };
    }

    case envActions.INITIALIZE_WS_COMPLETE: {
      return {
        ...state,
        initialized: true,
      };
    }

    case envActions.SET_WS_STATUS: {
      const { status } = action.payload;
      return {
        ...state,
        wsConnected: status,
      };
    }

    case envActions.SET_API_STATUS: {
      const { status } = action.payload;
      return {
        ...state,
        apiConnected: status,
      };
    }

    case envActions.SET_RPC_STATUS: {
      const { status } = action.payload;
      return {
        ...state,
        rpcConnected: status,
      };
    }

    case envActions.SET_TX_API: {
      const { txapi } = action.payload;
      return {
        ...state,
        getTXApi: txapi,
      };
    }

    case envActions.SET_TX_CLIENT: {
      const { client } = action.payload;
      return {
        ...state,
        txClient: client,
      };
    }

    case envActions.SET_QUERY_CLIENT: {
      const { client } = action.payload;
      return {
        ...state,
        queryClient: client,
      };
    }

    // case envActions.ADD_MESSAGE_TYPE: {
    //   let { typeUrl, type } = action.payload;
    //   state.client.registry.register(typeUrl, type);
    //   return {
    //     ...state,
    //   };
    // }

    default:
      return state;
  }
};

export default reducer;
