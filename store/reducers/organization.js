import { organizationActions } from "../actions/actionTypes";

const initialState = {
  creator: null,
  id: null,
  name: "",
  avatarUrl: "",
  followers: [],
  following: [],
  repositories: [],
  teams: [],
  members: {},
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
    case organizationActions.SET_ORGANIZATION:
      const { organization } = action.payload;
      return { ...state, ...organization };
    case organizationActions.SET_EMPTY_ORGANIZATION:
      return { ...initialState };
    default:
      return { ...state };
  }
};

export default reducer;
