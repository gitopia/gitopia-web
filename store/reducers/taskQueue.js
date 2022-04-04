const initialState = [];

const reducer = (state = initialState, action) => {
  let index = -2;
  if (action.payload && action.payload.id) {
    index = state.findIndex((x) => x.id === action.payload.id);
  }
  switch (action.type) {
    case "ADD_TASK_TO_QUEUE":
      if (index > -1) {
        console.log("----> task updated", action.payload);
        state[index] = action.payload;
        return state;
      } else {
        console.log("----> task added", action.payload);
        state.push(action.payload);
        return state;
      }
    case "REMOVE_TASK_FROM_QUEUE":
      if (index > -1) {
        console.log("----> task removed");
        state.splice(index, 1);
        return state;
      }
      return state;
    case "CLEAR_TASK_QUEUE":
      state.forEach((task) => {
        if (task.reject)
          task.reject({ message: "Queue cleared", noDispatch: true });
      });
      console.log("----> task queue cleared");
      return [];
    default:
      return state;
  }
};

export default reducer;
