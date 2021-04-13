import { combineReducers } from "redux";
import walletReducer from "./wallet";
import envReducer from "./env";
import starportReducer from "./starport";
// import hydrateReducer from "./hydrate";

const rootReducer = combineReducers({
  //   hydrate: hydrateReducer,
  wallet: walletReducer,
  env: envReducer,
  starport: starportReducer,
});

export default rootReducer;
