import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  startStarportPolling,
  stopStarportPolling,
} from "../store/actions/starport";

function BackendStatus(props) {
  useEffect(() => {
    props.startStarportPolling();
    return props.stopStarportPolling;
  }, []);

  return (
    <div>
      <h3>Services running</h3>
      <div className="grid grid-cols-3 w-64">
        <div>
          <span>Panel</span>
          <span
            className={
              "ml-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.isFrontendRunning ? "bg-green-900" : "bg-red-900")
            }
          />
        </div>
        <div>
          <span>API</span>
          <span
            className={
              "ml-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.isApiRunning ? "bg-green-900" : "bg-red-900")
            }
          />
        </div>
        <div>
          <span>RPC</span>
          <span
            className={
              "ml-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.isRpcRunning ? "bg-green-900" : "bg-red-900")
            }
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isFrontendRunning: state.starport.backend.running.frontend,
    isApiRunning: state.starport.backend.running.api,
    isRpcRunning: state.starport.backend.running.rpc,
  };
};

export default connect(mapStateToProps, {
  startStarportPolling,
  // stopStarportPolling,
})(BackendStatus);
