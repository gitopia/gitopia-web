import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toggleRepositoryForking } from "../../store/actions/repository";

function ToggleForking({
  repoOwner,
  repoName,
  allowForking,
  onSuccess,
  ...props
}) {
  const [currentState, setCurrentState] = useState(!!allowForking);
  const [isToggling, setIsToggling] = useState(false);
  const toggleForking = async () => {
    setIsToggling(true);
    const res = await props.toggleRepositoryForking({
      repoOwner: repoOwner,
      repoName: repoName,
    });
    if (res && res.code === 0) {
      if (onSuccess) await onSuccess();
    }
    setIsToggling(false);
  };

  useEffect(() => {
    setCurrentState(allowForking);
  }, [allowForking]);

  return (
    <label className="cursor-pointer label" data-test="allow-forking">
      <div>
        <div className="label-text">Allow Forking</div>
        <div className="label-text-alt text-type-secondary">
          Allow others to fork repository and send pull requests
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
          onChange={toggleForking}
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

export default connect(mapStateToProps, { toggleRepositoryForking })(
  ToggleForking
);
