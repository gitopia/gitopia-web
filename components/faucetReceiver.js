import { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "../helpers/axiosFetch";
import { updateUserBalance } from "../store/actions/wallet";
import { notify } from "reapop";
import { useApiClient } from "../context/ApiClientContext";

function FaucetReceiver(props) {
  const [loading, setLoading] = useState(0);
  const [tokenReceived, setTokenReceived] = useState(
    parseFloat(props.balance) !== 0
  );
  const { cosmosBankApiClient, cosmosFeegrantApiClient } = useApiClient();

  useEffect(() => {
    setTokenReceived(parseFloat(props.balance) !== 0);
  }, [props.balance]);

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
            props.updateUserBalance(
              cosmosBankApiClient,
              cosmosFeegrantApiClient,
              true
            );
            setLoading(0);
          }, 2000);
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

  return !tokenReceived ? (
    <div className="mb-8">
      <div className="bg-box-grad-tl bg-base-200 p-4 rounded-md mb-4">
        <div>
          <div className="text-lg">
            Get{" "}
            {props.advanceUser === true
              ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
              : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}{" "}
            tokens
          </div>
          <div className="text-xs mt-2 text-type-secondary">
            Use them to test Gitopia. Based on your activity you might get
            actual tokens on mainnet
          </div>
        </div>
        <div className="mt-4">
          <button
            className={
              "btn btn-sm btn-primary btn-outline btn-wide " +
              (loading ? "loading" : "")
            }
            onClick={() => getTokens(1)}
            disabled={loading}
            data-test="get-token"
          >
            Get{tokenReceived ? " More " : " "}
            {props.advanceUser === true
              ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
              : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    balance: state.wallet.balance,
    allowance: state.wallet.allowance,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  updateUserBalance,
  notify,
})(FaucetReceiver);
