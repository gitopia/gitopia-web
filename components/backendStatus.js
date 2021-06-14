import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  startStarportPolling,
  stopStarportPolling,
} from "../store/actions/starport";
import { init, config } from "../store/actions/env";

function BackendStatus(props) {
  useEffect(() => {
    props.init();
    // props.startStarportPolling();
    // return props.stopStarportPolling;
  }, []);

  return (
    <div className="px-8 my-8">
      <div className="text-md border-b border-grey py-2 mb-4">
        Services Running
      </div>
      <div className="grid grid-rows-3 w-64">
        <div className="mb-2">
          <span
            className={
              "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.wsConnected ? "bg-green-900" : "bg-red-900")
            }
          />
          <span className="text-sm">WebSocket</span>
        </div>
        <div className="mb-2">
          <span
            className={
              "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.apiConnected ? "bg-green-900" : "bg-red-900")
            }
          />
          <span className="text-sm">API</span>
        </div>
        <div className="mb-2">
          <span
            className={
              "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (props.rpcConnected ? "bg-green-900" : "bg-red-900")
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
    wsConnected: state.env.wsConnected,
    apiConnected: state.env.apiConnected,
    rpcConnected: state.env.rpcConnected,
    client: state.env.client,
  };
};

export default connect(mapStateToProps, {
  // startStarportPolling,
  // stopStarportPolling,
  init,
  config,
})(BackendStatus);
