import { connect } from "react-redux";
import router from "next/router";

function NotificationsList(props) {
  switch (props.showNotificationListState) {
    case "ISSUE":
      return (
        <div className="card w-96 px-0 py-0 bg-base-300 rounded-xl">
          <label className="text-lg text-base-content flex items-center">
            <h4 className="pl-5 pt-5">Issue Notifications</h4>
            <h4 className="text-sm text-green ml-auto mr-5 pt-5">
              {props.formattedIssueNotifications.length}
            </h4>
          </label>
          {props.formattedIssueNotifications.length ? (
            <ul className="menu text-xs mt-2 max-h-80 overflow-auto">
              {props.formattedIssueNotifications.map((n, i) => {
                return (
                  <li
                    key={"issue" + i}
                    onClick={() => {
                      router.push("/" + n.pathToRedirect);
                    }}
                  >
                    <a className="flex-wrap">
                      <span className="text-green mr-1">
                        {n.formattedMsg[0]}
                      </span>
                      <span className="mr-1">{n.formattedMsg[1]}</span>
                      <span className="mr-1 text-teal">
                        {n.formattedMsg[2]}
                      </span>
                      <span className="mr-1">{n.formattedMsg[3]}</span>
                      <span className="mr-1 text-teal">
                        {n.formattedMsg[4]}
                      </span>
                      <span className="mr-1">{n.formattedMsg[5]}</span>
                      <span className="mr-1 text-green">
                        {n.formattedMsg[6]}
                      </span>
                    </a>
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
        <div className="card w-96 px-0 py-0 bg-base-300 rounded-xl">
          <label className="text-lg text-base-content flex items-center">
            <h4 className="pl-5 pt-5">Pull Notifications</h4>
            <h4 className="text-sm text-green ml-auto mr-5 pt-5">
              {props.formattedPullNotifications.length}
            </h4>
          </label>
          {props.formattedPullNotifications.length ? (
            <ul className="menu text-xs mt-2 max-h-80 overflow-auto">
              {props.formattedPullNotifications.map((n, i) => {
                return (
                  <li
                    key={"pull" + i}
                    onClick={() => {
                      router.push("/" + n.pathToRedirect);
                    }}
                  >
                    <a className="flex-wrap">
                      <span className="text-green mr-1">
                        {n.formattedMsg[0]}
                      </span>
                      <span className="mr-1">{n.formattedMsg[1]}</span>
                      <span className="mr-1 text-teal">
                        {n.formattedMsg[2]}
                      </span>
                      <span className="mr-1">{n.formattedMsg[3]}</span>
                      <span className="mr-1 text-teal">
                        {n.formattedMsg[4]}
                      </span>
                      <span className="mr-1">{n.formattedMsg[5]}</span>
                      <span className="mr-1 text-green">
                        {n.formattedMsg[6]}
                      </span>
                    </a>
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
