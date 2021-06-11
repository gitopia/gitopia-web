import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  startStarportPolling,
  stopStarportPolling,
} from "../store/actions/starport";

function BackendStatus(props) {
  useEffect(() => {
    // props.startStarportPolling();
    return props.stopStarportPolling;
  }, []);

  return (
    <div className="px-8 my-8">
      <div className="text-md border-b border-grey py-2 mb-4">
        Services running
      </div>
      <div className="grid grid-rows-3 w-64">
        <div className="mb-2">
          <span
            className={
              "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.isFrontendRunning ? "bg-green-900" : "bg-red-900")
            }
          />
          <span className="text-sm">Panel</span>
        </div>
        <div className="mb-2">
          <span
            className={
              "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.isApiRunning ? "bg-green-900" : "bg-red-900")
            }
          />
          <span className="text-sm">API</span>
        </div>
        <div className="mb-2">
          <span
            className={
              "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.isRpcRunning ? "bg-green-900" : "bg-red-900")
            }
          />
          <span className="text-sm">RPC</span>
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
