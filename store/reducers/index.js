import { combineReducers } from "redux";
import walletReducer from "./wallet";
import repositoryReducer from "./repository";
import envReducer from "./env";
import starportReducer from "./starport";
// import hydrateReducer from "./hydrate";
import { reducer as notificationsReducer } from "reapop";
import userReducer from "./user";

const rootReducer = combineReducers({
  //   hydrate: hydrateReducer,
  wallet: walletReducer,
  repository: repositoryReducer,
  env: envReducer,
  starport: starportReducer,
  user: userReducer,
  notifications: notificationsReducer(),
});

export default rootReducer;
