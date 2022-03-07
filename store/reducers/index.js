import { combineReducers } from "redux";
import walletReducer from "./wallet";
import envReducer from "./env";
// import starportReducer from "./starport";
// import hydrateReducer from "./hydrate";
import { reducer as notificationsReducer } from "reapop";
import userReducer from "./user";
import organizationReducer from "./organization";

const rootReducer = combineReducers({
  //   hydrate: hydrateReducer,
  wallet: walletReducer,
  env: envReducer,
  // starport: starportReducer,
  user: userReducer,
  notifications: notificationsReducer(),
  organization: organizationReducer,
});

export default rootReducer;
