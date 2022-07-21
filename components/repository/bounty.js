import { createBounty } from "../../store/actions/bounties";
import getBalances from "../../helpers/getAllBalances";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
function CreateBounty(props) {
  const router = useRouter();
  var id = router.query.userId;
  const [counter, setCounter] = useState(1);
  const [balances, setBalances] = useState([]);
  const [expiry, setExpiry] = useState("");
  const [amount, setAmount] = useState([]);
  const [tokenDenom, setTokenDenom] = useState([]);
  const [maxAmount, setMaxAmount] = useState([]);
  const [validateAmountError, setValidateAmountError] = useState("");
  const [click, setClick] = useState(false);
  useEffect(async () => {
    const b = await getBalances(id);
    setBalances(b.balances);
    /* setBalances([
      {
        denom: "utlore",
        amount: "89794159",
      },
      {
        denom: "tlore",
        amount: "12345",
      },
      {
        denom: "lore",
        amount: "794159",
      },
      {
        denom: "btc",
        amount: "97949",
      },
    ]); */
  }, [id]);
  const handleClick = () => {
    setCounter(counter + 1);
    let array = amount.slice();
    array.push(undefined);
    setAmount(array);
    array = tokenDenom.slice();
    array.push(undefined);
    setTokenDenom(array);
    array = maxAmount.slice();
    array.push(undefined);
    setMaxAmount(array);
  };

  const handleDelete = (index) => {
    let arr = props.bountyAmount;
    arr.splice(index, 1);
    props.setBountyAmount(arr);
  };

  const handleAdd = (amountToSend = [], expiry = 0) => {
    setClick(true);
    props.setBountyExpiry(expiry);
    props.setBountyAmount(amountToSend);
  };
  const handleAmountOnChange = (value, index) => {
    const array = amount.slice();
    array[index] = value;
    setAmount(array);
  };

  const handleTokenDenomOnChange = (value, index) => {
    const array = tokenDenom.slice();
    array[index] = value;
    setTokenDenom(array);
  };

  const handleMaxAmountOnChange = (denom, index) => {
    const i = balances.map((object) => object.denom).indexOf(denom);
    const array = maxAmount.slice();
    array[index] = balances[i].amount;
    setMaxAmount(array);
  };

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
  return (
    <div className={props.issue ? "ml-auto" : "flex mt-4 mb-4 text-xs"}>
      {props.issue ? (
        <label
          className="ml-auto btn btn-primary text-xs btn-sm modal-button"
          htmlFor="my-modal"
        >
          NEW BOUNTY
        </label>
      ) : (
        <div className="flex">
          {click ? (
            <div className="flex">
              {props.bountyAmount.map((a, i) => {
                return (
                  <div
                    className={
                      "flex text-sm box-border bg-grey-500 mr-2 h-11 p-3 rounded-lg uppercase"
                    }
                  >
                    <div className="mr-2">{a.denom}</div>
                    <div>{a.amount}</div>
                    <div className="link ml-8 mt-1 no-underline" onClick={""}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.5303 1.5304C13.8231 1.23751 13.8231 0.762637 13.5303 0.469744C13.2374 0.176851 12.7625 0.176851 12.4696 0.469744L13.5303 1.5304ZM0.46967 12.4697C0.176777 12.7626 0.176777 13.2374 0.46967 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L0.46967 12.4697ZM12.4696 13.5303C12.7625 13.8231 13.2374 13.8231 13.5303 13.5303C13.8231 13.2374 13.8231 12.7625 13.5303 12.4696L12.4696 13.5303ZM1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L1.53033 0.46967ZM12.4696 0.469744L0.46967 12.4697L1.53033 13.5303L13.5303 1.5304L12.4696 0.469744ZM13.5303 12.4696L1.53033 0.46967L0.46967 1.53033L12.4696 13.5303L13.5303 12.4696Z"
                          fill="#E5EDF5"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <label
              className="link link-primary no-underline modal-button mt-3.5 ml-3"
              htmlFor="my-modal"
            >
              <div className="flex">
                <div className="mr-2 font-bold text-white">ADD BOUNTY</div>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-1"
                >
                  <path d="M5 0V10" stroke="#66CE67" stroke-width="2" />
                  <path
                    d="M10 5L-3.57628e-07 5"
                    stroke="#66CE67"
                    stroke-width="2"
                  />
                </svg>
              </div>
            </label>
          )}
        </div>
      )}

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label htmlFor="my-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          <div className="flex mb-4">
            <div className="w-11/12 font-bold text-sm text-type">
              Add bounty
            </div>
            <label
              htmlFor="my-modal"
              className="ml-auto hover:opacity-25"
              onClick={() => {
                setAmount([]);
                setCounter(1);
                setTokenDenom([]);
                setMaxAmount([]);
                setExpiry("");
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
            </label>
          </div>
          {Array.from(Array(counter)).map((c, index) => {
            return (
              <div
                className="card w-full bg-grey-900 shadow-xl mt-4"
                key={index}
              >
                <div className="card-body p-3">
                  <div className="mb-2 text-grey-200">AMOUNT</div>
                  <div className="flex mb-2">
                    <div>
                      <input
                        className="appearance-none bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none text-2xl font-bold"
                        type="text"
                        placeholder="Enter Amount"
                        aria-label="Full name"
                        onKeyUp={async (e) => {
                          await validateAmount(e.target.value);
                        }}
                        onChange={(e) => {
                          handleAmountOnChange(e.target.value, index);
                        }}
                      ></input>
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
                    <select
                      className="select w-fit max-w-xs ml-auto h-10"
                      value={tokenDenom[index]}
                      onChange={(e) => {
                        handleTokenDenomOnChange(e.target.value, index);
                        handleMaxAmountOnChange(e.target.value, index);
                      }}
                    >
                      <option selected>Select Token</option>
                      {balances.map((t, i) => {
                        return !tokenDenom.includes(t.denom) ? (
                          <option key={i} value={t.denom}>
                            {t.denom}
                          </option>
                        ) : (
                          <option key={i} value={t.denom} disabled={true}>
                            {t.denom}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex ml-auto text-grey-200">
                    <div className="text-xs mr-1">Balance:</div>
                    <div className="text-xs mr-2">{maxAmount[index]}</div>
                    <div
                      className="link link-primary text-xs text-primary font-bold no-underline"
                      onClick={(e) => {
                        //setAmount(maxAmount);
                      }}
                    >
                      Max
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {
            <div className="mt-6 text-right">
              <div className="inline-block w-36">
                <button
                  className={"btn btn-xs btn-primary btn-block h-5 w-32 "}
                  disabled={
                    !(counter < balances.length) ||
                    amount.includes(undefined) ||
                    tokenDenom.includes(undefined)
                  }
                  onClick={handleClick}
                >
                  ADD TOKEN
                </button>
              </div>
            </div>
          }

          <div className="card w-full bg-grey-900 shadow-xl mt-3">
            <div className="card-body p-3">
              <div className="flex">
                <div className="" onClick={() => {}}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 2V5"
                      stroke="#E5EDF5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M8 2V5"
                      stroke="#E5EDF5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M3 7.5C3 6.43913 3.42143 5.42172 4.17157 4.67157C4.92172 3.92143 5.93913 3.5 7 3.5H17C18.0609 3.5 19.0783 3.92143 19.8284 4.67157C20.5786 5.42172 21 6.43913 21 7.5V18C21 19.0609 20.5786 20.0783 19.8284 20.8284C19.0783 21.5786 18.0609 22 17 22H7C5.93913 22 4.92172 21.5786 4.17157 20.8284C3.42143 20.0783 3 19.0609 3 18V7.5Z"
                      stroke="#E5EDF5"
                      stroke-width="1.5"
                    />
                    <path
                      d="M3 9H21"
                      stroke="#E5EDF5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div className="flex text-xs mt-1 ml-1.5">Expiry date</div>
                <input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  className="appearance-none bg-transparent border-none leading-tight focus:outline-none ml-auto text-grey-200 text-xs"
                  onKeyUp={async (e) => {}}
                  onChange={(e) => {
                    setExpiry(e.target.value);
                  }}
                ></input>
              </div>
            </div>
          </div>
          <div className="flex ml-auto self-center">
            <div className="modal-action">
              <label
                htmlFor="my-modal"
                className="btn w-96 px-56 flex-1 bg-green-900 text-xs ml-1"
                onClick={(e) => {
                  let amountToSend = [];
                  for (let i = 0; i < amount.length; i++) {
                    const a = {
                      amount: amount[i].toString(),
                      denom: tokenDenom[i],
                    };
                    amountToSend.push(a);
                  }
                  {
                    props.issue
                      ? props.createBounty(
                          amountToSend,
                          dayjs(expiry.toString()).unix(),
                          props.issue.iid,
                          "issue"
                        )
                      : handleAdd(
                          amountToSend,
                          dayjs(expiry.toString()).unix()
                        );
                  }
                  setAmount([]);
                  setCounter(1);
                  setTokenDenom([]);
                  setMaxAmount([]);
                  setExpiry("");
                }}
                disabled={
                  amount.length == 0 ||
                  amount.includes(undefined) ||
                  tokenDenom.includes(undefined) ||
                  tokenDenom.length == 0 ||
                  expiry == ""
                }
              >
                ADD
              </label>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    advanceUser: state.user.advanceUser,
    loreBalance: state.wallet.loreBalance,
  };
};

export default connect(mapStateToProps, {
  createBounty,
})(CreateBounty);
