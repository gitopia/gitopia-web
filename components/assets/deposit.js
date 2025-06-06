import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { ibcDeposit } from "../../store/actions/wallet";
import { useRouter } from "next/router";
import { getBalanceForChain } from "../../helpers/getBalanceForChain";
import { notify, dismissNotification } from "reapop";

function DepositIbcAsset(props) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validateAmountError, setValidateAmountError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [tokenDenom, setTokenDenom] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);
  // const router = useRouter();
  // useEffect(() => {
  //   if (
  //     props.activeWallet?.counterPartyAddress === undefined ||
  //     props.activeWallet.counterPartyChain === null
  //   ) {
  //     router.push("/home");
  //   }
  // }, []);

  useEffect(() => {
    async function getChain() {
      if (props.ibcAssets.chainInfo.chain.chain_name) {
        setTokenDenom(
          props.ibcAssets.chainInfo.asset.assets[0].denom_units[1].denom
        );
        let b = await getBalanceForChain(
          props.ibcAssets.chainInfo.chain.apis.rest,
          props.activeWallet?.counterPartyAddress,
          props.ibcAssets.chainInfo.asset.assets[0].denom_units[0].denom
        );
        setBalance(
          b /
            Math.pow(
              10,
              props.ibcAssets.chainInfo.asset.assets[0].denom_units[1].exponent
            )
        );
        setTokenDecimals(
          props.ibcAssets.chainInfo.asset.assets[0].denom_units[1].exponent
        );
      }
    }
    if (props.openDeposit) getChain();
  }, [props.activeWallet, props.openDeposit]);

  function fillAmount(amount) {
    document.getElementById("amount").value = amount.toString();
  }
  function isNaturalNumber(n) {
    n = n.toString();
    var n1 = Math.abs(n),
      n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  const validateAmount = (amount) => {
    setValidateAmountError(null);
    let Vamount = Number(amount);
    if (amount == "" || amount == 0) {
      setValidateAmountError("Enter a valid amount");
    }
    if (Vamount > 0 && isNaturalNumber(Vamount * Math.pow(10, tokenDecimals))) {
      if (Vamount > balance) {
        setValidateAmountError("Insufficient balance");
        return false;
      }
    } else {
      setValidateAmountError("Enter a valid amount");
      return false;
    }
    return true;
  };
  return (
    <div>
      <input
        type="checkbox"
        checked={props.openDeposit}
        readOnly
        className="modal-toggle"
      />
      {props.openDeposit ? (
        <div className="modal">
          <div className="modal-box bg-grey-500">
            <div className="flex mb-4">
              <div className="w-11/12 font-bold text-sm text-type">
                Deposit IBC Asset
              </div>
              <div
                htmlFor="my-modal-2"
                className="link no-underline ml-auto hover:opacity-25"
                onClick={() => {
                  props.setOpenDeposit(false);
                }}
              >
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5303 2.0304C13.8231 1.73751 13.8231 1.26264 13.5303 0.969744C13.2374 0.676851 12.7625 0.676851 12.4696 0.969744L13.5303 2.0304ZM0.46967 12.9697C0.176777 13.2626 0.176777 13.7374 0.46967 14.0303C0.762563 14.3232 1.23744 14.3232 1.53033 14.0303L0.46967 12.9697ZM12.4696 14.0303C12.7625 14.3231 13.2374 14.3231 13.5303 14.0303C13.8231 13.7374 13.8231 13.2625 13.5303 12.9696L12.4696 14.0303ZM1.53033 0.96967C1.23744 0.676777 0.762563 0.676777 0.46967 0.96967C0.176777 1.26256 0.176777 1.73744 0.46967 2.03033L1.53033 0.96967ZM12.4696 0.969744L0.46967 12.9697L1.53033 14.0303L13.5303 2.0304L12.4696 0.969744ZM13.5303 12.9696L1.53033 0.96967L0.46967 2.03033L12.4696 14.0303L13.5303 12.9696Z"
                    fill="#E5EDF5"
                  />
                </svg>
              </div>
            </div>
            <div className="text-white">IBC Transfer</div>
            <div className="border border-gray-700 rounded-xl p-3 text-xs mt-3">
              <div className="font-bold">FROM</div>
              <div className="text-type-secondary">
                {props.activeWallet?.counterPartyAddress}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-9 border border-gray-700 p-1.5 rounded-lg mt-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3.33334L10 16.6667"
                    stroke="white"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15.8332 10.8333L9.99984 16.6667L4.1665 10.8333"
                    stroke="white"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </div>
            <div className="border border-gray-700 rounded-xl p-3 text-xs mt-2">
              <div className="font-bold">TO</div>
              <div className="text-type-secondary">{props.selectedAddress}</div>
            </div>
            <div className="text-white mt-5">Amount to Deposit</div>
            <div className="border border-gray-700 rounded-xl p-3 text-xs mt-2">
              <div className="font-bold">
                Available Balance : {balance} {tokenDenom?.toUpperCase()}
              </div>
              <div className="border border-gray-700 rounded-xl p-3 bg-grey-900 mt-2">
                <div className="flex">
                  <input
                    className={
                      "appearance-none bg-transparent border-none  focus:outline-none w-full " +
                      (validateAmountError
                        ? "border-pink text-pink focus:border-pink"
                        : amount.length > 0
                        ? "border-green"
                        : "")
                    }
                    type="text"
                    placeholder="Enter Amount"
                    aria-label="Amount"
                    id="amount"
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      validateAmount(e.target.value);
                    }}
                    onMouseUp={(e) => {
                      validateAmount(e.target.value);
                    }}
                  ></input>
                  <div
                    className="link link-primary text-xs text-primary font-bold no-underline ml-auto"
                    onClick={(e) => {
                      fillAmount(balance);
                      setAmount(balance);
                    }}
                  >
                    Max
                  </div>
                </div>
              </div>
              {validateAmountError ? (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validateAmountError}
                  </span>
                </label>
              ) : (
                ""
              )}
            </div>

            <div className="modal-action">
              <label
                htmlFor="my-modal-2"
                className={"btn btn-primary btn-block " + loading}
                onClick={(e) => {
                  setLoading(true);
                  let notifId;
                  const loadingMessage = props.notify(
                    "Despositing " +
                      amount +
                      " " +
                      tokenDenom.toUpperCase() +
                      "...",
                    "loading",
                    {
                      dismissible: false,
                      dismissAfter: 0,
                    }
                  );
                  notifId = loadingMessage.payload.id;
                  props
                    .ibcDeposit(
                      props.ibcAssets.chainInfo.ibc.chain_1.chain_name.includes(
                        "gitopia"
                      )
                        ? props.ibcAssets.chainInfo.ibc.channels[0].chain_2
                            .port_id
                        : props.ibcAssets.chainInfo.ibc.channels[0].chain_1
                            .port_id,
                      props.ibcAssets.chainInfo.ibc.chain_1.chain_name.includes(
                        "gitopia"
                      )
                        ? props.ibcAssets.chainInfo.ibc.channels[0].chain_2
                            .channel_id
                        : props.ibcAssets.chainInfo.ibc.channels[0].chain_1
                            .channel_id,
                      (Number(amount) * Math.pow(10, tokenDecimals)).toString(),
                      props.ibcAssets.chainInfo.asset.assets[0].denom_units[0]
                        .denom
                    )
                    .then((res) => {
                      if (res) {
                        props.notify(
                          "Deposit " +
                            amount +
                            " " +
                            tokenDenom.toUpperCase() +
                            " successful",
                          "info"
                        );
                      }
                      setLoading(false);
                      props.dismissNotification(notifId);
                    });
                  props.setOpenDeposit(false);
                }}
                disabled={validateAmountError}
              >
                DEPOSIT
              </label>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    activeWallet: state.wallet.activeWallet,
    ibcAssets: state.ibcAssets,
  };
};

export default connect(mapStateToProps, {
  ibcDeposit,
  notify,
  dismissNotification,
})(DepositIbcAsset);
