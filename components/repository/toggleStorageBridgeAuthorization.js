import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateAddressGrant } from "../../store/actions/user";
import getStorageBridgeAuthStatus from "../../helpers/getStorageBridgeAuthStatus";

function ToggleStorageBridgeAuthorization({ address, onSuccess, ...props }) {
  const [currentState, setCurrentState] = useState(false);
  const [isToggling, setIsToggling] = useState(true);

  const toggleGrant = async () => {
    setIsToggling(true);
    const res = await props.updateAddressGrant(address, 1, !currentState);
    if (res && res.code === 0) {
      if (onSuccess) await onSuccess(!currentState);
      setCurrentState(!currentState);
    }
    console.log(res);
    setIsToggling(false);
  };

  useEffect(async () => {
    setIsToggling(true);
    setCurrentState(await getStorageBridgeAuthStatus(address));
    setIsToggling(false);
  }, [address]);

  return (
    <label className="cursor-pointer label">
      <div>
        <div className="label-text">
          Backup repositories to Filecoin and pin it to IPFS
        </div>
        <div className="label-text-alt text-type-secondary">
          Storage provider address:{" "}
          {process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS}
        </div>
      </div>
      <div
        className={
          "btn btn-disabled btn-sm btn-ghost" + (isToggling ? " loading" : "")
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
  ToggleStorageBridgeAuthorization
);
