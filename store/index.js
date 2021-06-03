import rootReducer from "./reducers/index";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    return {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
  }

  return rootReducer(state, action);
};

const initStore = (context) => {
  const isServer = typeof window === "undefined";
  // let composeEnhancers = compose;

  //Check if function running on the sever or client
  // if (!options.isServer) {
  //Setup Redux Debuger
  // composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // }
  console.log("initStore server?", isServer);

  const composeEnhancers =
    (typeof window !== "undefined" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  return createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(thunk) //Applying redux-thunk middleware
    )
  );
};

// const makeStore = context => createStore(reducer);

export const wrapper = createWrapper(initStore, { debug: true });
