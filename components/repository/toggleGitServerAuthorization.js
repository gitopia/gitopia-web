import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateGitServerGrant } from "../../store/actions/user";
import getGitServerAuthStatus from "../../helpers/getGitServerAuthStatus";
import { Api } from "../../store/cosmos.authz.v1beta1/module/rest";

function ToggleGitServerAuthorization({ onSuccess, ...props }) {
  const [currentState, setCurrentState] = useState(false);
  const [isToggling, setIsToggling] = useState(true);

  const toggleGrant = async () => {
    setIsToggling(true);
    const res = await props.updateGitServerGrant(!currentState);
    if (res && res.code === 0) {
      if (onSuccess) await onSuccess(!currentState);
      setCurrentState(!currentState);
    }
    console.log(res);
    setIsToggling(false);
  };

  useEffect(async () => {
    setIsToggling(true);
    setCurrentState(await getGitServerAuthStatus(props.selectedAddress));
    setIsToggling(false);
  }, [props.selectedAddress]);

  return (
    <label className="cursor-pointer label">
      <div>
        <div className="label-text">
          Allow forking repositories on you behalf
        </div>
        <div className="label-text-alt text-type-secondary">
          Bridge address: {process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS}
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

export default connect(mapStateToProps, { updateGitServerGrant })(
  ToggleGitServerAuthorization
);
