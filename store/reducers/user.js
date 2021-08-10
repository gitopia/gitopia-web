import { userActions } from "../actions/actionTypes";

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
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case userActions.SET_USER:
      const { user } = action.payload;
      return { ...state, ...user };
    case userActions.SET_EMPTY_USER:
      console.log("resetting user to ", initialState);
      return { ...initialState };
    default:
      return { ...state };
  }
};

export default reducer;
