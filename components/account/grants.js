import { useEffect, useState } from "react";
import { connect } from "react-redux";
import ToggleStorageBridgeAuthorization from "../repository/toggleStorageBridgeAuthorization";
import ToggleGitServerAuthorization from "../repository/toggleGitServerAuthorization";

function AccountGrants({ ...props }) {
  return (
    <>
      <div className="mt-8">
        <div className="form-control sm:px-4 py-4 sm:py-6">
          <ToggleGitServerAuthorization user={props.user} />
        </div>
        <div className="form-control sm:px-4 py-4 sm:py-6">
          <ToggleStorageBridgeAuthorization user={props.user} />
        </div>
      </div>
    </>
  );
}

export default AccountGrants;
