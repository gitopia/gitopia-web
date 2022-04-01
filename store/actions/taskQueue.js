export const watchTask = (id) => {
  return async (dispatch, getState) => {
    const state = getState().taskQueue;
    console.log("Attempt to watch taskId", id, state);
    let index = state.findIndex((x) => x.id === id);
    if (index > -1) {
      //Task already in queue, must be completed ?
      const task = { ...state[index] };
      if (
        task.TaskState === "TASK_STATE_FAILURE" ||
        task.TaskState === "TASK_STATE_SUCCESS"
      ) {
        console.log("Found task", task);
        dispatch({ type: "STOP_RECORDING_TASKS" });
        dispatch({ type: "CLEAR_TASK_QUEUE" });
        return task;
      } else {
        console.log("TaskState not satifactory. continue watching..", task);
      }
    }
    console.log("Watching taskId", id);
    return new Promise((resolve, reject) => {
      dispatch({
        type: "ADD_TASK_TO_QUEUE",
        payload: {
          id: Number(id),
          resolve: (task) => {
            dispatch({ type: "REMOVE_TASK_FROM_QUEUE", payload: { id: id } });
            resolve(task);
          },
          reject: (task) => {
            dispatch({ type: "REMOVE_TASK_FROM_QUEUE", payload: { id: id } });
            reject(task);
          },
        },
      });
    });
  };
};

export const addCompletedTask = (task) => {
  return {
    type: "ADD_TASK_TO_QUEUE",
    payload: { id: Number(task.TaskId), ...task },
  };
};
