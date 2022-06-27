import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getBalance } from "../../store/actions/wallet";
import { notify } from "reapop";
import {
  transferToWallet,
  updateUserBalance,
} from "../../store/actions/wallet";
import shrinkAddress from "../../helpers/shrinkAddress";

function SupportOwner({ ownerAddress, isMobile, ...props }) {
  const [ownerBalance, setOwnerBalance] = useState(0);
  const [validateAmountError, setValidateAmountError] = useState("");
  const [amount, setAmount] = useState(0);

  function isNaturalNumber(n) {
    n = n.toString();
    var n1 = Math.abs(n),
      n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  const validateAmount = async (amount) => {
    setValidateAmountError(null);
    let Vamount = Number(amount);
    if (amount == "" || amount == 0) {
      setValidateAmountError("Enter Valid Amount");
    }

    let balance = props.loreBalance;
    if (props.advanceUser === false) {
      Vamount = Vamount * 1000000;
    }
    if (Vamount > 0 && isNaturalNumber(Vamount)) {
      if (Vamount < 10 || Vamount > 0) {
        if (Vamount > balance) {
          setValidateAmountError("Insufficient Balance");
        }
      } else {
        setValidateAmountError("Amount should be in range 1-10");
      }
    } else {
      setValidateAmountError("Enter a Valid Amount");
    }
  };

  useEffect(async () => {
    const balance = await props.getBalance(ownerAddress);
    setOwnerBalance(
      props.advanceUser === true
        ? balance + " " + process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
        : balance / 1000000 + " " + process.env.NEXT_PUBLIC_CURRENCY_TOKEN
    );
  }, [ownerAddress]);

  return (
    <div className="p-4 border border-gray-700 rounded flex flex-col items-start gap-4 sm:flex-row sm:items-center ">
      <div className="flex">
        <div
          className="border rounded-full w-7 h-7 mr-2 flex items-center justify-center"
          style={{ borderColor: "#66CE67" }}
        >
          <svg
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.99915 8.99353C8.30597 8.99353 10.176 7.20848 10.176 5.00651C10.176 2.80454 8.30597 1.01949 5.99915 1.01949C3.69232 1.01949 1.82227 2.80454 1.82227 5.00651C1.82227 7.20848 3.69232 8.99353 5.99915 8.99353Z"
              stroke="#66CE67"
              strokeWidth="1.5"
            />
            <path
              d="M10.178 12.9806C10.178 10.7786 8.30791 8.99358 6.00109 8.99358C3.69426 8.99358 1.82422 10.7786 1.82422 12.9806"
              stroke="#66CE67"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div>
          <div
            className="text-type-tertiary font-semibold uppercase"
            style={{ fontSize: "0.5rem" }}
          >
            Owner Address
          </div>
          <div className="text-xs">{ownerAddress}</div>
        </div>
      </div>
      <div className="flex">
        <div
          className="border rounded-full w-7 h-7 mr-2 sm:ml-4 flex items-center justify-center"
          style={{ borderColor: "#883BE6" }}
        >
          <svg
            width="10"
            height="17"
            viewBox="0 0 10 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.00061 8.51845C6.33523 8.51845 7.41715 7.43653 7.41715 6.10192C7.41715 4.7673 6.33523 3.68538 5.00061 3.68538C3.666 3.68538 2.58408 4.7673 2.58408 6.10192C2.58408 7.43653 3.666 8.51845 5.00061 8.51845ZM5.00061 10.2314C7.28128 10.2314 9.13013 8.38259 9.13013 6.10192C9.13013 3.82125 7.28128 1.9724 5.00061 1.9724C2.71994 1.9724 0.871094 3.82125 0.871094 6.10192C0.871094 8.38259 2.71994 10.2314 5.00061 10.2314Z"
              fill="#883BE6"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.58408 11.1195C2.58408 11.7593 2.84059 12.3714 3.29468 12.8215C3.74849 13.2713 4.36229 13.5225 5.00061 13.5225C5.63893 13.5225 6.25273 13.2713 6.70655 12.8215C7.16063 12.3714 7.41715 11.7593 7.41715 11.1195H9.13013C9.13013 12.2004 8.69698 13.2386 7.92343 14.0053C7.14962 14.7723 6.09841 15.2046 5.00061 15.2046C3.90281 15.2046 2.8516 14.7723 2.07779 14.0053C1.30425 13.2386 0.871094 12.2004 0.871094 11.1195H2.58408Z"
              fill="#883BE6"
            />
            <path
              d="M4.19727 0.743828H5.8455V2.39206H4.19727V0.743828Z"
              fill="#883BE6"
            />
            <path
              d="M4.19727 14.7537H5.8455V16.4019H4.19727V14.7537Z"
              fill="#883BE6"
            />
          </svg>
        </div>
        <div className="">
          <div
            className="text-type-tertiary font-semibold uppercase"
            style={{ fontSize: "0.5rem" }}
          >
            Balance Available
          </div>
          <div className="text-xs uppercase">{ownerBalance}</div>
        </div>
      </div>

      <div className="sm:ml-auto self-center">
        <label
          htmlFor="my-modal-2"
          className="link link-primary modal-button text-xs uppercase no-underline"
        >
          SUPPORT PROJECT
        </label>
      </div>
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="mb-2 w-full">
            <div className="flex">
              <div className="w-11/12 font-bold text-sm">
                SUPPORT THIS PROJECT
              </div>
            </div>
            <div className="text-xs mt-5">
              You can support this project by sending{" "}
              {props.advanceUser === true
                ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                : process.env.NEXT_PUBLIC_CURRENCY_TOKEN}{" "}
              to its DAO or creator.
            </div>
            <div className="text-xs">
              To do it you just need to send your funds to the address below.
            </div>
            <div className="mt-2 text-xs">
              This address only accepts{" "}
              {props.advanceUser === true
                ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                : process.env.NEXT_PUBLIC_CURRENCY_TOKEN}
              , any other coin or token will be lost if sent to this address.
            </div>
          </div>
          <label className="label">
            <span className="label-text text-xs font-bold text-gray-400">
              DAO TREASURY ADDRESS
            </span>
          </label>
          <div className="flex border border-gray-700 rounded-lg p-3 text-xs">
            <div className="w-11/12">{ownerAddress}</div>
            <button
              className="ml-auto self-center"
              onClick={(e) => {
                navigator.clipboard.writeText(ownerAddress);
                props.notify("Copied to clipboard", "info");
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="10"
                  y="10"
                  width="18"
                  height="18"
                  stroke="#ADBECB"
                  strokeWidth="2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 2H18.0769V8.92308H20.0769V2V0H18.0769H2H0V2V18.0769V20.0769H2H8.92308V18.0769H2V2Z"
                  fill="#ADBECB"
                />
              </svg>
            </button>
          </div>
          <div>
            <label className="label">
              <span className="label-text text-xs font-bold text-gray-400">
                TOKEN AMOUNT
              </span>
            </label>
            <div>
              <input
                name="Amount"
                placeholder="Enter Amount"
                autoComplete="off"
                onKeyUp={async (e) => {
                  await validateAmount(e.target.value);
                }}
                onMouseUp={async (e) => {
                  await validateAmount(e.target.value);
                }}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                className="w-full h-11 input input-xs input-ghost input-bordered "
              />
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
          <div className="flex w-full btn-group">
            <div className="w-9/12">
              <label className="label">
                <span className="label-text text-xs font-bold text-gray-400">
                  AVAILABLE TOKENS
                </span>
              </label>
              <div className="flex">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="12.4167"
                    stroke="#883BE6"
                    strokeWidth="1.16667"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.0006 12.5184C14.3352 12.5184 15.4171 11.4365 15.4171 10.1019C15.4171 8.7673 14.3352 7.68538 13.0006 7.68538C11.666 7.68538 10.5841 8.7673 10.5841 10.1019C10.5841 11.4365 11.666 12.5184 13.0006 12.5184ZM13.0006 14.2314C15.2813 14.2314 17.1301 12.3826 17.1301 10.1019C17.1301 7.82125 15.2813 5.9724 13.0006 5.9724C10.7199 5.9724 8.87109 7.82125 8.87109 10.1019C8.87109 12.3826 10.7199 14.2314 13.0006 14.2314Z"
                    fill="#883BE6"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.5841 15.1195C10.5841 15.7593 10.8406 16.3714 11.2947 16.8215C11.7485 17.2713 12.3623 17.5225 13.0006 17.5225C13.6389 17.5225 14.2527 17.2713 14.7065 16.8215C15.1606 16.3714 15.4171 15.7593 15.4171 15.1195H17.1301C17.1301 16.2004 16.697 17.2386 15.9234 18.0053C15.1496 18.7723 14.0984 19.2046 13.0006 19.2046C11.9028 19.2046 10.8516 18.7723 10.0778 18.0053C9.30425 17.2386 8.87109 16.2004 8.87109 15.1195H10.5841Z"
                    fill="#883BE6"
                  />
                  <path
                    d="M12.1973 4.74383H13.8455V6.39206H12.1973V4.74383Z"
                    fill="#883BE6"
                  />
                  <path
                    d="M12.1973 18.7537H13.8455V20.4019H12.1973V18.7537Z"
                    fill="#883BE6"
                  />
                </svg>
                <div className="pl-3">
                  <div className="text-xs h-3/4">
                    {props.advanceUser === true
                      ? props.loreBalance
                      : props.loreBalance / 1000000}{" "}
                    {props.advanceUser === true
                      ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
                      : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex ml-auto self-center">
              <div className="modal-action">
                <label
                  htmlFor="my-modal-2"
                  className="btn btn-sm btn-primary flex-1 bg-green-900"
                  onClick={(e) => {
                    props
                      .transferToWallet(
                        props.selectedAddress,
                        ownerAddress,
                        props.advanceUser === true
                          ? amount.toString()
                          : (amount * 1000000).toString()
                      )
                      .then(async (res) => {
                        props.updateUserBalance();
                        props.notify("Transaction Successful", "info");
                        const balance = await props.getBalance(ownerAddress);
                        setOwnerBalance(
                          props.advanceUser === true
                            ? balance +
                                " " +
                                process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                            : balance / 1000000 +
                                " " +
                                process.env.NEXT_PUBLIC_CURRENCY_TOKEN
                        );
                      });
                  }}
                  disabled={validateAmountError !== null}
                >
                  CONTRIBUTE
                </label>
                <label htmlFor="my-modal-2" className="btn btn-sm">
                  Close
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loreBalance: state.wallet.loreBalance,
    selectedAddress: state.wallet.selectedAddress,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  getBalance,
  transferToWallet,
  updateUserBalance,
  notify,
})(SupportOwner);
