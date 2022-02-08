import { userNotificationActions } from "../actions/actionTypes";

/*
const user = {
  address: null,
  notifications: [],
};

const notification = {
  msg: "",
  unread: true,
};
*/
const initialState = [];

let notificationId = 0;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case userNotificationActions.ADD_USER_NOTIFICATIONS:
      return [
        ...state,
        {
          id: notificationId++,
          msg: action.payload.msg,
          unread: true,
          type: action.payload.type,
        },
      ];

    case userNotificationActions.MARK_AS_READ:
      return state.map((notification) => {
        if (notification.type === action.payload.type) {
          Object.assign(notification, { unread: false });
        }
      });

    default:
      return [...state];
  }
};

export default reducer;
