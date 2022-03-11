import { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { updateUserBalance } from "../store/actions/wallet";
import { notify } from "reapop";

function FaucetReceiver(props) {
  const [loading, setLoading] = useState(0);
  const [tokenReceived, setTokenReceived] = useState(
    parseFloat(props.loreBalance) !== 0
  );

  useEffect(() => {
    setTokenReceived(parseFloat(props.loreBalance) !== 0);
  }, [props.loreBalance]);

  const getTokens = (amount) => {
    if (loading !== 0) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(amount);

    axios
      .post(
        process.env.NODE_ENV === "development"
          ? "/api/faucet"
          : process.env.NEXT_PUBLIC_FAUCET_URL,
        {
          address: props.selectedAddress,
        },
        { timeout: 10000 }
      )
      .then((res) => {
        if (
          res &&
          res.data &&
          res.data.transfers &&
          res.data.transfers.length &&
          res.data.transfers[0].status === "error"
        ) {
          props.notify(res.data.transfers[0].error, "error");
          setLoading(0);
        } else {
          setTimeout(() => {
            props.updateUserBalance(true);
            setLoading(0);
          }, 5000);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          props.notify(err.response.data.error, "error");
        } else {
          props.notify("Unable to reach faucet", "error");
        }
        setLoading(0);
      });
  };

  return (
    <div className="flex bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
      <div
        className={
          "w-14 h-14 flex-none mr-10 flex justify-center items-center rounded-full border" +
          (tokenReceived ? " border-green bg-green-900" : " border-grey")
        }
      >
        {tokenReceived ? (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
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
        )}
      </div>
      <div className="flex-1 mr-8">
        <div className="text-lg">
          Get testnet tokens{" "}
          {props.advanceUser === true
            ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
            : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
        </div>
        <div className="text-xs mt-2 text-type-secondary">
          Use them to test Gitopia. Based on your activity you might get actual
          tokens on mainnet
        </div>
      </div>

      <div className="flex-none w-60 mr-8">
        <button
          className={
            "btn btn-sm btn-primary btn-outline btn-block " +
            (loading ? "loading" : "")
          }
          onClick={() => getTokens(1)}
          disabled={loading}
        >
          Get{tokenReceived ? " More " : " "}
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
  updateUserBalance,
  notify,
})(FaucetReceiver);
