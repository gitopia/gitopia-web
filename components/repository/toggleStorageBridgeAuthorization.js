import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateStorageGrant } from "../../store/actions/user";
import getStorageBridgeAuthStatus from "../../helpers/getStorageBridgeAuthStatus";
import { Api } from "../../store/cosmos.authz.v1beta1/module/rest";

function ToggleStorageBridgeAuthorization({ onSuccess, ...props }) {
  const [currentState, setCurrentState] = useState(false);
  const [isToggling, setIsToggling] = useState(true);

  const toggleGrant = async () => {
    setIsToggling(true);
    const res = await props.updateStorageGrant(!currentState);
    if (res && res.code === 0) {
      if (onSuccess) await onSuccess(!currentState);
      setCurrentState(!currentState);
    }
    console.log(res);
    setIsToggling(false);
  };

  useEffect(async () => {
    // const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
    // const res = await api.queryGrants({
    //   granter: props.selectedAddress,
    //   grantee: process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS,
    // });
    // if (res?.data?.grants) console.log("Storage Grants", res.data.grants);
    setIsToggling(true);
    setCurrentState(await getStorageBridgeAuthStatus(props.selectedAddress));
    setIsToggling(false);
  }, [props.selectedAddress]);

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

export default connect(mapStateToProps, { updateStorageGrant })(
  ToggleStorageBridgeAuthorization
);
