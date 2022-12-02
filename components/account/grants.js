import ToggleStorageBridgeAuthorization from "../repository/toggleStorageBridgeAuthorization";
import ToggleGitServerAuthorization from "../repository/toggleGitServerAuthorization";

function AccountGrants({ address, ...props }) {
  return (
    <div className="py-4">
      <div className="form-control py-4 sm:py-6">
        <ToggleGitServerAuthorization address={address} />
      </div>
      <div className="form-control py-4 sm:py-6">
        <ToggleStorageBridgeAuthorization address={address} />
      </div>
    </div>
  );
}

export default AccountGrants;
