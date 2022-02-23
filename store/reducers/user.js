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
  organizations: [],
  starred_repos: [],
  subscriptions: "",
  email: "",
  bio: "",
  createdAt: "0",
  updatedAt: "0",
  extensions: "",
  currentDashboard: get("currentDashboard"),
  dashboards: [],
  advanceUser: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case userActions.SET_USER:
      const { user } = action.payload;
      return { ...state, ...user };

    case userActions.SET_EMPTY_USER:
      return { ...initialState };

    case userActions.SET_CURRENT_DASHBOARD: {
      const { id } = action.payload;
      set("currentDashboard", id);
      return {
        ...state,
        currentDashboard: id,
      };
    }

    case userActions.INIT_DASHBOARDS: {
      const { name, id } = action.payload;
      const dashboards = [
        {
          type: "User",
          name,
          id,
          url: "/home",
        },
        ...state.organizations.map((o) => {
          return {
            type: "Organization",
            ...o,
            url: "/daos/" + o.id + "/dashboard",
          };
        }),
      ];
      return { ...state, dashboards };
    }

    default:
      return { ...state };
  }
};

export default reducer;
