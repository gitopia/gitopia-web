import { useState, useEffect } from "react";
import { readNotification } from "../../store/actions/userNotification";
import { connect } from "react-redux";
import db from "../../helpers/db";

function NotificationsCard(props) {
  const [issueNotifications, setIssueNotifications] = useState(0);
  const [pullNotifications, setPullNotifications] = useState(0);

  async function unreadNotificationIndexDB(type) {
    try {
      db.notifications.where("type").equals(type).modify({ unread: false });
    } catch (error) {
      console.log(error);
    }
  }

  function countNotification() {
    let countIssue = 0;
    let countPulls = 0;
    let issueList = [];
    let pullList = [];
    db.notifications.each(function (notification) {
      if (notification.unread === true && notification.type === "issue") {
        countIssue++;
        setIssueNotifications(countIssue);
        issueList.push(notification);
        props.setFormattedIssueNotifications(issueList);
      }
      if (notification.unread === true && notification.type === "pulls") {
        countPulls++;
        setPullNotifications(countPulls);
        pullList.push(notification);
        props.setFormattedPullNotifications(pullList);
      }
    });
  }

  useEffect(async () => {
    countNotification();
  }, [db.notifications]);

  return (
    <div className="card w-96 px-5 py-5 bg-base-300 rounded-xl">
      <div className="flex">
        <div className="h-9 w-9 bg-blue bg-opacity-10 rounded-lg flex items-center mr-3">
          <div className="mx-1.5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.0718 18L12 6L18.9282 18H5.0718Z"
                stroke="#ADBECB"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <label className="text-lg text-base-content flex items-center">
          <h4>Issues</h4>
        </label>

        {issueNotifications === 0 ? (
          <button
            className="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-grey-300"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            NO ISSUES
          </button>
        ) : (
          <button
            className="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-green"
            onClick={() => {
              props.setMenuOpen(true);
              props.setMenuState(6);
              props.setShowNotificationListState("ISSUE");
              props.readNotification("issue");
              unreadNotificationIndexDB("issue");
            }}
          >
            {issueNotifications + " NEW"}
          </button>
        )}
      </div>
      <div className="flex mt-2">
        <div className="h-9 w-9 bg-blue bg-opacity-10 rounded-lg flex items-center mr-3">
          <div className="mx-3">
            <svg
              width="12"
              height="18"
              viewBox="0 0 12 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 15.5V9M2.5 2.5V9M2.5 9H7C8.10457 9 9 9.89543 9 11V15.5"
                stroke="#ADBECB"
                strokeWidth="2"
              />
              <circle cx="2.5" cy="15.5" r="2.5" fill="#ADBECB" />
              <circle cx="2.5" cy="2.5" r="2.5" fill="#ADBECB" />
              <path
                d="M11.5 15.5C11.5 16.8807 10.3807 18 9 18C7.61929 18 6.5 16.8807 6.5 15.5C6.5 14.1193 7.61929 13 9 13C10.3807 13 11.5 14.1193 11.5 15.5Z"
                fill="#ADBECB"
              />
            </svg>
          </div>
        </div>
        <label className="text-lg text-base-content flex items-center">
          <h4>Pull Requests</h4>
        </label>

        {pullNotifications === 0 ? (
          <button
            className="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-grey-300"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            NO PRS
          </button>
        ) : (
          <button
            className="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-green"
            onClick={() => {
              props.setShowNotificationListState("PULLS");
              props.setMenuOpen(true);
              props.setMenuState(6);
              props.readNotification("pulls");
              unreadNotificationIndexDB("pulls");
            }}
          >
            {pullNotifications + " NEW"}
          </button>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    userNotification: state.userNotification,
  };
};

export default connect(mapStateToProps, {
  readNotification,
})(NotificationsCard);
