const initialState = [];

const reducer = (state = initialState, action) => {
  let index = -2;
  if (action.payload && action.payload.id) {
    index = state.findIndex((x) => x.id === action.payload.id);
  }
  switch (action.type) {
    case "ADD_TASK_TO_QUEUE":
      if (index > -1) {
        state[index] = action.payload;
        return state;
      } else {
        state.push(action.payload);
        return state;
      }
    case "REMOVE_TASK_FROM_QUEUE":
      if (index > -1) {
        state.splice(index, 1);
        return state;
      }
      return state;
    case "CLEAR_TASK_QUEUE":
      state.forEach((task) => {
        if (task.reject)
          task.reject({ message: "Queue cleared", noDispatch: true });
      });
      return [];
    default:
      return state;
  }
};

export default reducer;
