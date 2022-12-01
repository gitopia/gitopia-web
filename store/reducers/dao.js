import { daoActions } from "../actions/actionTypes";

const initialState = {
  creator: null,
  id: null,
  name: "",
  avatarUrl: "",
  followers: [],
  following: [],
  repositories: [],
  teams: [],
  members: [],
  location: "",
  email: "",
  website: "",
  verified: false,
  description: "",
  createdAt: "0",
  updatedAt: "0",
  extensions: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case daoActions.SET_DAO:
      const { dao } = action.payload;
      return { ...state, ...dao };
    case daoActions.SET_EMPTY_DAO:
      return { ...initialState };
    default:
      return { ...state };
  }
};

export default reducer;
