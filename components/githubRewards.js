import { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "../helpers/axiosFetch";
import { calculateGithubRewards } from "../store/actions/user";
import { notify } from "reapop";

function GithubRewards(props) {
  const [loading, setLoading] = useState(false);
  const [tokenReceived, setTokenReceived] = useState(
    parseFloat(props.loreBalance) !== 0
  );

  useEffect(() => {
    setTokenReceived(parseFloat(props.loreBalance) !== 0);
  }, [props.loreBalance]);

  const getTokens = async () => {
    if (loading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(true);
    const res = await props.calculateGithubRewards();
    console.log(res);
    setLoading(false);
  };

  return (
    <div className="sm:flex bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md mb-8">
      <div className="flex">
        <div
          className={
            "w-14 h-14 flex-none mr-5 sm:mr-10 flex justify-center items-center rounded-full border border-grey"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
            />
          </svg>
        </div>
        <div className="flex-1 mr-8">
          <div className="text-lg">
            Get Github reward tokens{" "}
            {props.advanceUser === true
              ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
              : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
          </div>
          <div className="text-xs mt-2 text-type-secondary">
            These are distributed based on your contributions to Open Source
            repositories
          </div>
        </div>
      </div>
      <div className="flex-none w-60 mr-8 mt-4 sm:mt-0">
        <button
          className={
            "btn btn-sm btn-accent btn-outline btn-block " +
            (loading ? "loading" : "")
          }
          onClick={getTokens}
          disabled={loading}
        >
          {"Get Reward "}
          {props.advanceUser === true
            ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
            : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    loreBalance: state.wallet.loreBalance,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  calculateGithubRewards,
  notify,
})(GithubRewards);
