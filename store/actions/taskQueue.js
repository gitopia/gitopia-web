const WATCH_TASK_REJECT_TIMEOUT = 15 * 1000;

export const watchTask = (id, taskDescription) => {
  return async (dispatch, getState) => {
    const state = getState().taskQueue;
    console.log("Watching Task", id, "State", state);
    let index = state.findIndex((x) => x.id === Number(id));
    if (index > -1) {
      //Task already in queue, must be completed ?
      const task = { ...state[index] };
      if (
        task.TaskState === "TASK_STATE_FAILURE" ||
        task.TaskState === "TASK_STATE_SUCCESS"
      ) {
        dispatch({ type: "STOP_RECORDING_TASKS" });
        dispatch({ type: "CLEAR_TASK_QUEUE" });
        return task;
      } else if (task.resolve) {
        return null;
      } else {
      }
    }
    return new Promise((resolve, reject) => {
      let autoRejectTimeout = setTimeout(() => {
        dispatch({ type: "REMOVE_TASK_FROM_QUEUE", payload: { id: id } });
        reject(new Error(taskDescription + " timed out"));
      }, WATCH_TASK_REJECT_TIMEOUT);
      dispatch({
        type: "ADD_TASK_TO_QUEUE",
        payload: {
          id: Number(id),
          resolve: (task) => {
            clearTimeout(autoRejectTimeout);
            if (!task.noDispatch) {
              dispatch({ type: "REMOVE_TASK_FROM_QUEUE", payload: { id: id } });
            }
            resolve(task);
          },
          reject: (task) => {
            clearTimeout(autoRejectTimeout);
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
