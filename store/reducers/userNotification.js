import { userNotificationActions } from "../actions/actionTypes";

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
      state = action.payload.userNotification;
      const notifications = state.map((i) => {
        if (i.type !== action.payload.type) {
          return i;
        }
        return { ...i, unread: false };
      });

      return [...notifications];

    default:
      return [...state];
  }
};

export default reducer;
