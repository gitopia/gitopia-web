import { repositoryActions } from "../actions/actionTypes";

const initialState = {
  repositorys: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case repositoryActions.ADD_REPOSITORY: {
      let { repository } = action.payload;
      let repositorys = state.repositorys;
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
