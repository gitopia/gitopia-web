import { ibcAssetsActions } from "../actions/actionTypes";

const initialState = {
  assetList: [],
  chainInfo: {
    chain: {},
    asset: {},
    ibc: {},
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ibcAssetsActions.SET_CHAIN_INFO: {
      const { chain, assets, ibc } = action.payload;
      return { ...state, chainInfo: { chain: chain, asset: assets, ibc: ibc } };
    }
    case ibcAssetsActions.SET_ASSET_LIST: {
      const { assets } = action.payload;
      return { ...state, assetList: assets };
    }
    default:
      return { ...state };
  }
};
export default reducer;
