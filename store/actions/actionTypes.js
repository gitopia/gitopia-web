export const walletActions = {
  SET_ACTIVE_WALLET: "SET_ACTIVE_WALLET",
  ADD_WALLET: "ADD_WALLET",
  PATH_INCREMENT: "PATH_INCREMENT",
  ADD_ACCOUNT: "ADD_ACCOUNT",
  SET_RELAYERS: "SET_RELAYERS",
  SET_SELECTED_ADDRESS: "SET_SELECTED_ADDRESS",
  SET_BACKUP_STATE: "SET_BACKUP_STATE",
  SIGN_OUT: "SIGN_OUT",
  STORE_WALLETS: "STORE_WALLETS",
  UPDATE_BALANCE: "UPDATE_BALANCE",
  UPDATE_ALLOWANCE: "UPDATE_ALLOWANCE",
  REMOVE_WALLET: "REMOVE_WALLET",
  GET_PASSWORD_FOR_UNLOCK_WALLET: "GET_PASSWORD_FOR_UNLOCK_WALLET",
  RESET_PASSWORD_FOR_UNLOCK_WALLET: "RESET_PASSWORD_FOR_UNLOCK_WALLET",
  START_UNLOCKING_WALLET: "START_UNLOCKING_WALLET",
  STOP_UNLOCKING_WALLET: "STOP_UNLOCKING_WALLET",
};

export const userActions = {
  SET_USER: "SET_USER",
  SET_EMPTY_USER: "SET_EMPTY_USER",
  SET_CURRENT_DASHBOARD: "SET_CURRENT_DASHBOARD",
  INIT_DASHBOARDS: "INIT_DASHBOARDS",
  UPDATE_DASHBOARD_ENTRY: "UPDATE_DASHBOARD_ENTRY",
};

export const daoActions = {
  SET_DAO: "SET_DAO",
  SET_EMPTY_DAO: "SET_EMPTY_DAO",
};

export const repositoryActions = {
  ADD_REPOSITORY: "ADD_REPOSITORY",
  STORE_REPOSITORYS: "STORE_REPOSITORYS",
};

export const envActions = {
  SET_CONFIG: "SET_CONFIG",
  CONNECT: "CONNECT",
  INITIALIZE_WS_COMPLETE: "INITIALIZE_WS_COMPLETE",
  SET_WS_STATUS: "SET_WS_STATUS",
  SET_API_STATUS: "SET_API_STATUS",
  SET_RPC_STATUS: "SET_RPC_STATUS",
  SET_TX_API: "SET_TX_API",
  SET_CLIENTS: "SET_CLIENTS",
};

export const starportActions = {
  SET_STARPORT_ENV: "SET_STARPORT_ENV",
  SET_BACKEND_RUNNING_STATES: "SET_BACKEND_RUNNING_STATES",
  SET_BACKEND_ENV: "SET_BACKEND_ENV",
  SET_PREV_STATES: "SET_PREV_STATES",
  SET_TIMER: "SET_TIMER",
  CLEAR_TIMER: "CLEAR_TIMER",
};

export const userNotificationActions = {
  ADD_USER_NOTIFICATIONS: "ADD_USER_NOTIFICATIONS",
  MARK_AS_READ: "MARK_AS_READ",
};

export const ibcAssetsActions = {
  SET_CHAIN_INFO: "SET_CHAIN_INFO",
  SET_ASSET_LIST: "SET_ASSET_LIST",
};
