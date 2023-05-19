import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  updateUserBalance,
  updateUserAllowance,
} from "../store/actions/wallet";
import axios from "../helpers/axiosFetch";
import { useRouter } from "next/router";
import { notify } from "reapop";

function FundWallet(props) {
  const [gettingFaucetTokens, setGettingFaucetTokens] = useState(false);
  const balanceElem = useRef();
  const isBalanceLow =
    Number(props.balance) <= 500 && Number(props.allowance) <= 500;
  const router = useRouter();

  const getTokens = () => {
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    if (!isBalanceLow) {
      return;
    }
    setGettingFaucetTokens(true);

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
          res?.data?.transfers &&
          res?.data?.transfers.length &&
          res.data.transfers[0].status === "error"
        ) {
          props.notify(res.data.transfers[0].error, "error");
          setGettingFaucetTokens(false);
        } else {
          setTimeout(() => {
            props.updateUserBalance(true);
            setGettingFaucetTokens(false);
          }, 2000);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data?.error) {
          props.notify(err.response.data.error, "error");
        } else {
          props.notify("Unable to reach faucet", "error");
        }
        setGettingFaucetTokens(false);
      });
  };

  useEffect(() => {
    getTokens();
    props.updateUserAllowance();
  }, []);

  useEffect(() => {
    if (!isBalanceLow) {
      if (balanceElem?.current) {
        balanceElem.current.classList.add("animate");
        setTimeout(() => {
          balanceElem?.current?.classList.remove("animate");
        }, 2000);
      }
    }
  }, [props.balance, props.allowance]);

  return (
    <>
      <div className="text-4xl mt-16 sm:mt-0 sm:text-6xl mb-6">
        Fund Your Wallet
      </div>
      <div className="text-xs text-type-secondary mb-12">
        Please get some{" "}
        {(process.env.NEXT_PUBLIC_CURRENCY_TOKEN || "").toUpperCase()} to
        proceed with profile creation
      </div>
      <div className="max-w-md w-full px-4 mb-4 text-center">
        <div className="relative">
          <input
            rows={2}
            cols={120}
            name="repository-url"
            type="text"
            value={props.selectedAddress}
            readOnly={true}
            className="w-full input input-ghost input-md input-bordered py-2 pr-14"
          />
          <button
            className="absolute right-0 top-0 btn btn-ghost btn-md"
            onClick={(e) => {
              navigator.clipboard.writeText(props.selectedAddress);
              props.notify("Copied to clipboard", "info");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-w-md w-full px-4 text-center text-md">
        {props.allowance ? (
          <div className="confetti text-accent-focus" ref={balanceElem}>
            <div>
              {props.allowance / 1000000 +
                " " +
                (process.env.NEXT_PUBLIC_CURRENCY_TOKEN || "").toUpperCase()}
            </div>
            <div className="text-xs">(Fee Grant)</div>
          </div>
        ) : (
          <div className="confetti text-accent-focus" ref={balanceElem}>
            {props.balance / 1000000 +
              " " +
              (process.env.NEXT_PUBLIC_CURRENCY_TOKEN || "").toUpperCase()}
          </div>
        )}
      </div>

      <div className="max-w-md w-full p-4 pt-0">
        <div className="text-center h-8">
          {gettingFaucetTokens ? (
            <a className="btn btn-xs loading btn-accent btn-outline border-none">
              Getting tokens from faucet...
            </a>
          ) : (
            ""
          )}
        </div>
        <div className="mb-4 flex gap-4">
          <a
            className={"btn btn-outline flex-1"}
            href="https://osmosis.zone"
            target="_blank"
            rel="noreferrer"
            disabled={true}
          >
            <img src="/tokens/osmo.svg" className="w-4 h-4 mr-2"></img>
            Buy on Osmosis Dex
          </a>
          <a
            className={"btn btn-outline flex-1"}
            href="https://discord.gg/aqsKW3hUHD"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 127.14 96.36"
              className="w-4 h-4 mr-2"
            >
              <g>
                <g>
                  <g>
                    <path
                      d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                      fill="#7289da"
                    />
                  </g>
                </g>
              </g>
            </svg>
            Ask out at Discord
          </a>
        </div>
        <div className="">
          <button
            className={"btn btn-secondary btn-block"}
            disabled={isBalanceLow}
            onClick={() => {
              router.push("/login?step=6");
            }}
            data-test="fund_wallet_next"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
    selectedAddress: state.wallet.selectedAddress,
    balance: state.wallet.balance,
    allowance: state.wallet.allowance,
  };
};

export default connect(mapStateToProps, {
  updateUserBalance,
  updateUserAllowance,
  notify,
})(FundWallet);
