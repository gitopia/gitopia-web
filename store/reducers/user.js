import { userActions } from "../actions/actionTypes";
import { get, set, del } from "../persist";

const initialState = {
  creator: null,
  username: null,
  usernameGithub: null,
  avatarUrl: null,
  followers: [],
  following: [],
  repositories: [],
  repositories_archived: [],
  repositoryNames: {},
  organizations: [],
  starred_repos: [],
  subscriptions: "",
  email: "",
  bio: "",
  createdAt: "0",
  updatedAt: "0",
  extensions: "",
  currentDashboard: get("currentDashboard"),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case userActions.SET_USER:
      const { user } = action.payload;
      return { ...state, ...user };

    case userActions.SET_EMPTY_USER:
      return { ...initialState };

    case userActions.SET_CURRENT_DASHBOARD: {
      const { type, address } = action.payload;
      set("set currentDashboard", { type, address });
      return {
        ...state,
        currentDashboard: { type, address },
      };
    }

    default:
      return { ...state };
  }
};

export default reducer;
