export const watchTask = (id) => {
  return async (dispatch, getState) => {
    const state = getState().taskQueue;
    let index = state.findIndex((x) => x.id === Number(id));
    console.log("Attempt to watch taskId", id, index);
    if (index > -1) {
      //Task already in queue, must be completed ?
      const task = { ...state[index] };
      console.log("Found task already", task);
      if (
        task.TaskState === "TASK_STATE_FAILURE" ||
        task.TaskState === "TASK_STATE_SUCCESS"
      ) {
        console.log("Found completed task");
        dispatch({ type: "STOP_RECORDING_TASKS" });
        dispatch({ type: "CLEAR_TASK_QUEUE" });
        return task;
      } else if (task.resolve) {
        console.log("Already watching task");
        return null;
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
            if (!task.noDispatch) {
              dispatch({ type: "REMOVE_TASK_FROM_QUEUE", payload: { id: id } });
            }
            resolve(task);
          },
          reject: (task) => {
            if (!task.noDispatch) {
              dispatch({ type: "REMOVE_TASK_FROM_QUEUE", payload: { id: id } });
            }
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
