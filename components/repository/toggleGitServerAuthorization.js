import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateAddressGrant } from "../../store/actions/user";
import getGitServerAuthStatus from "../../helpers/getGitServerAuthStatus";
import { useApiClient } from "../../context/ApiClientContext";

function ToggleGitServerAuthorization({ address, onSuccess, ...props }) {
  const [currentState, setCurrentState] = useState(false);
  const [isToggling, setIsToggling] = useState(true);
  const { apiClient } = useApiClient();

  const toggleGrant = async () => {
    setIsToggling(true);
    const res = await props.updateAddressGrant(
      apiClient,
      address,
      0,
      !currentState
    );
    if (res && res.code === 0) {
      if (onSuccess) await onSuccess(!currentState);
      setCurrentState(!currentState);
    }
    setIsToggling(false);
  };

  useEffect(() => {
    async function initAddress() {
      setIsToggling(true);
      setCurrentState(await getGitServerAuthStatus(apiClient, address));
      setIsToggling(false);
    }
    initAddress();
  }, [address]);

  return (
    <label className="cursor-pointer label">
      <div>
        <div className="label-text">
          Authorize git server (Required to enable forking of repositories and
          merging pull requests)
        </div>
        <div className="label-text-alt text-type-secondary">
          Provider address: {process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS}
        </div>
      </div>
      <div
        className={
          "btn btn-disabled btn-sm bg-transparent" +
          (isToggling ? " loading" : "")
        }
      >
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={currentState}
          onChange={toggleGrant}
          disabled={isToggling}
        />
      </div>
    </label>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, { updateAddressGrant })(
  ToggleGitServerAuthorization
);
