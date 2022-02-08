import { useState } from "react";
import { readNotification } from "../../store/actions/userNotification";
import { connect } from "react-redux";
import { STATUSES } from "reapop";

function NotificationsCard(props) {
  const [notifications, setNotifications] = useState({
    issues: 1,
    pulls: 5,
    gov: 1,
    toDos: 8,
  });

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
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
        <label className="text-lg text-base-content flex items-center">
          <h4>Issues</h4>
        </label>

        {notifications.issues === 0 ? (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-grey-300"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            NO ISSUES
          </button>
        ) : (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-green"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
              props.readNotification("issue");
            }}
          >
            {notifications.issues + " NEW"}
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
                stroke-width="2"
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

        {notifications.pulls === 0 ? (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-grey-300"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            NO PRS
          </button>
        ) : (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-green"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            {notifications.pulls + " NEW"}
          </button>
        )}
      </div>
      <div className="flex mt-2">
        <div className="h-9 w-9 bg-blue bg-opacity-10 rounded-lg flex items-center mr-3">
          <div className="mx-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10.0005"
                cy="9.99932"
                r="8.65484"
                stroke="#ADBECB"
                stroke-width="2"
              />
              <path
                d="M18.3865 8.22557C17.6578 7.1307 14.1387 6.32495 9.97263 6.32495C5.90649 6.32495 2.48857 7.10477 1.65039 8.16064"
                stroke="#ADBECB"
                stroke-width="2"
              />
              <path
                d="M18.4002 11.7019C17.6693 12.791 14.1746 13.5945 9.99612 13.5945C5.91782 13.5945 2.46325 12.8017 1.62256 11.7515"
                stroke="#ADBECB"
                stroke-width="2"
              />
              <path
                d="M10.1797 19.3074C10.1797 18.4936 10.1797 14.6222 10.1797 9.96917C10.1797 5.4277 10.1797 1.63087 10.1797 0.694702"
                stroke="#ADBECB"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
        <label className="text-lg text-base-content flex items-center">
          <h4>Governance</h4>
        </label>

        {notifications.gov === 0 ? (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-grey-300"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            NO NOTIFICATIONS
          </button>
        ) : (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-green"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            {notifications.gov + " NEW"}
          </button>
        )}
      </div>
      <div className="flex mt-2">
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
                d="M5.11035 13.9871L8.39497 17.272L18.4056 7.26172"
                stroke="#ADBECB"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
        <label className="text-lg text-base-content flex items-center">
          <h4>To-Do</h4>
        </label>

        {notifications.toDos === 0 ? (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-grey-300"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            NO TO-DOS
          </button>
        ) : (
          <button
            class="btn btn-ghost btn-sm ml-auto text-xs font-bold flex items-center text-green"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            {notifications.toDos + " NEW"}
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

export default connect(mapStateToProps, { readNotification })(
  NotificationsCard
);
