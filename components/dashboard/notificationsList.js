import { useState, useEffect } from "react";
import { readNotification } from "../../store/actions/userNotification";
import { connect } from "react-redux";
import db from "../../helpers/db";

function NotificationsList(props) {
  switch (props.showNotificationListState) {
    case "ISSUE":
      return (
        <div className="card w-full px-5 py-5 bg-base-300 rounded-xl">
          <label className="text-lg text-base-content flex items-center">
            <h4>Issue Notifications</h4>
          </label>
          {props.formattedIssueNotifications.length ? (
            <ul className="menu text-xs mt-2 max-h-80 overflow-auto">
              {props.formattedIssueNotifications.map((n, i) => {
                return (
                  <li key={"branch-selector" + i}>
                    <a className="whitespace-nowrap">{n.formattedMsg}</a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-xs p-5 text-type-secondary">
              {"Nothing to show"}
            </div>
          )}
        </div>
      );
    case "PULLS":
      return (
        <div className="card w-full px-5 py-5 bg-base-300 rounded-xl">
          <label className="text-lg text-base-content flex items-center">
            <h4>Pulls Notifications</h4>
          </label>
          {props.formattedPullNotifications.length ? (
            <ul className="menu text-xs mt-2 max-h-80 overflow-auto">
              {props.formattedPullNotifications.map((n, i) => {
                return (
                  <li key={"branch-selector" + i}>
                    <a className="whitespace-nowrap">{n.formattedMsg}</a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-xs p-5 text-type-secondary">
              {"Nothing to show"}
            </div>
          )}
        </div>
      );
    default:
      return (
        <div className="card w-full px-5 py-5 bg-base-300 rounded-xl">
          <label className="text-lg text-base-content flex items-center">
            <h4>Notifications</h4>
          </label>
          <div className="text-xs p-5 text-type-secondary">
            {"Nothing to show"}
          </div>
        </div>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    userNotification: state.userNotification,
  };
};

export default connect(mapStateToProps, {})(NotificationsList);
