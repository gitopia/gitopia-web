import { starportActions } from "../actions/actionTypes";

const initialState = {
  _timer: null,
  starportUrl: "http://localhost:8080",
  frontendUrl: "",
  backend: {
    env: {
      node_js: false,
      vue_app_custom_url: null, //process.env.VUE_APP_CUSTOM_URL,
    },
    running: {
      frontend: false,
      rpc: false,
      api: false,
    },
    prevStates: {
      frontend: null,
      rpc: null,
      api: null,
    },
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case starportActions.SET_STARPORT_ENV: {
      const { starportUrl, frontendUrl } = action.payload;
      return {
        ...state,
        starportUrl,
        frontendUrl,
      };
    }

    case starportActions.SET_BACKEND_RUNNING_STATES: {
      const { frontend, rpc, api } = action.payload;
      state.backend.running = {
        frontend,
        rpc,
        api,
      };
      return {
        ...state,
      };
    }

    case starportActions.SET_BACKEND_ENV: {
      const { node_js, vue_app_custom_url } = action.payload;
      state.backend.env = {
        node_js,
        vue_app_custom_url,
      };
      return {
        ...state,
      };
    }

    case starportActions.SET_PREV_STATES: {
      const { status } = action.payload;
      state.backend.prevStates = {
        frontend: status ? status.is_my_app_frontend_alive : false,
        rpc: status ? status.is_consensus_engine_alive : false,
        api: status ? status.is_my_app_backend_alive : false,
      };
      return {
        ...state,
      };
    }

    case starportActions.SET_TIMER: {
      const { timer } = action.payload;
      return {
        ...state,
        _timer: timer,
      };
    }

    case starportActions.CLEAR_TIMER: {
      clearInterval(state._timer);
      break;
    }

    default:
      return state;
  }
};

export default reducer;
