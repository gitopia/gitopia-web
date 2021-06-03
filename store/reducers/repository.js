import { repositoryActions } from "../actions/actionTypes";

const isServer = typeof window === "undefined";

const set = (key, value) => {
  if (isServer) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log("Error while saving", key, e);
  }
};

const get = (key) => {
  if (isServer) return;
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (e) {
    console.log("Error while saving", key, e);
    return null;
  }
};

const initialState = {
  repositorys: get("repositorys") || [],
};


const reducer = (state = initialState, action) => {
  switch (action.type) {

    case repositoryActions.ADD_REPOSITORY: {
      let { repository } = action.payload;
      let repositorys = state.repositorys;
      set("lastRepositorys", repository.name);
      if (repository.name) {
        repositorys.push({
          name: repository.name,
          description: repository.description,
        });
      }
      return {
        ...state,
        repositorys: repositorys,
      };
    }

    case repositoryActions.STORE_REPOSITORYS: {
      set("repositorys", state.repositorys);
      return {
        ...state,
        backupState: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;
      
