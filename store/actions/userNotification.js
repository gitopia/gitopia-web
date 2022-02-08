import { userNotificationActions } from "./actionTypes";

export const createNotification = (msg, type) => {
  console.log("create Notification");
  return async (dispatch, getState) => {
    dispatch({
      type: userNotificationActions.ADD_USER_NOTIFICATIONS,
      payload: {
        msg: msg,
        type: type,
      },
    });
  };
};

export const readNotification = (type) => {
  return async (dispatch, getState) => {
    const { userNotification } = getState();
    dispatch({
      type: userNotificationActions.MARK_AS_READ,
      payload: {
        userNotification,
        type: type,
      },
    });
  };
};
