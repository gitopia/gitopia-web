import { ibcAssetsActions } from "./actionTypes";

export const setIbcAssets = (assets) => {
  return async (dispatch) => {
    dispatch({
      type: ibcAssetsActions.SET_ASSET_LIST,
      payload: {
        assets: assets,
      },
    });
  };
};
