const initialState = [];

const reducer = (state = initialState, action) => {
  console.log(state);
  let index = -2;
  if (action.payload && action.payload.id && state.findIndex) {
    index = state.findIndex((x) => x.id === action.payload.id);
  }
  switch (action.type) {
    case "ADD_TASK_TO_QUEUE":
      if (index > -1) {
        console.log("----> task updated");
        state[index] = action.payload;
        return state;
      } else {
        console.log("----> task added");
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
        if (task.reject) task.reject({ message: "Queue cleared" });
      });
      console.log("----> task queue cleared");
      return [];
    default:
      return state;
  }
};

export default reducer;
