import { combineReducers } from "redux";
import walletReducer from "./wallet";
import envReducer from "./env";
// import starportReducer from "./starport";
// import hydrateReducer from "./hydrate";
import { reducer as notificationsReducer } from "reapop";
import userReducer from "./user";
import daoReducer from "./dao";
import userNotificationReducer from "./userNotification";
import ibcAssetsReducer from "./ibcAssets";

const rootReducer = combineReducers({
  //   hydrate: hydrateReducer,
  wallet: walletReducer,
  env: envReducer,
  // starport: starportReducer,
  user: userReducer,
  notifications: notificationsReducer(),
  dao: daoReducer,
  userNotification: userNotificationReducer,
  ibcAssets: ibcAssetsReducer,
});

export default rootReducer;
