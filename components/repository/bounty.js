import { createBounty } from "../../store/actions/bounties";
import getBalances from "../../helpers/getAllBalances";
import { connect } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import getDenomNameByHash from "../../helpers/getDenomNameByHash";
import getTokenValueInDollars from "../../helpers/getTotalTokenValueInDollars";
import { coingeckoId } from "../../ibc-assets-config";
import { useApiClient } from "../../context/ApiClientContext";

function CreateBounty(props) {
  const router = useRouter();
  var id = router.query.userId;
  const [counter, setCounter] = useState(0);
  const [balances, setBalances] = useState([]);
  const [expiry, setExpiry] = useState("");
  const [amount, setAmount] = useState([]);
  const [tokenDenom, setTokenDenom] = useState([]);
  const [maxAmount, setMaxAmount] = useState([]);
  const [validateAmountError, setValidateAmountError] = useState(null);
  const [click, setClick] = useState(false);
  const [tokenKV, setTokenKV] = useState({});
  const [isAddingNewToken, setIsAddingNewToken] = useState(false);
  const [dollarValue, setDollarValue] = useState(0);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  // const ref3 = useRef("dd/mm/yyyy");
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  useEffect(() => {
    async function getBalance() {
      const b = await getBalances(cosmosBankApiClient, props.selectedAddress);
      let kv = {};
      if (b) {
        for (let i = 0; i < b.balances.length; i++) {
          if (b.balances[i].denom.includes("ibc")) {
            let denomName = await getDenomNameByHash(b.balances[i].denom);
            if (denomName) {
              b.balances[i].showDenom = coingeckoId[denomName].coinDenom;
              b.balances[i].amount =
                b.balances[i].amount /
                Math.pow(10, coingeckoId[denomName].coinDecimals);
              kv[b.balances[i].denom] = {
                denom: denomName,
                standardDenom: coingeckoId[denomName].coinDenom,
              };
            }
          } else {
            b.balances[i].showDenom =
              coingeckoId[b.balances[i].denom].coinDenom;
            b.balances[i].amount =
              b.balances[i].amount /
              Math.pow(10, coingeckoId[b.balances[i].denom].coinDecimals);
            kv[b.balances[i].denom] = {
              denom: b.balances[i].denom,
              standardDenom: coingeckoId[b.balances[i].denom].coinDenom,
            };
          }
        }
        setTokenKV(kv);
        setBalances(b.balances);
      }
    }
    getBalance();
  }, [props.selectedAddress]);

  useEffect(() => {
    console.log("bountyAmount", props);
    if (props.bountyAmount.length < 1) {
      setClick(false);
      setCounter(0);
      setIsAddingNewToken(true);
    }
  }, [props.bountyAmount]);

  async function getDollarValue(denom, amount) {
    let dollar = await getTokenValueInDollars(
      denom,
      amount * Math.pow(10, coingeckoId[denom].coinDecimals)
    );

    if (dollar) {
      setDollarValue(dollar);
    }
  }

  const handleClick = () => {
    let arr = props.bountyAmount.slice();
    let coinDecimals =
      coingeckoId[
        tokenDenom[counter].includes("ibc")
          ? tokenKV[tokenDenom[counter]].denom
          : tokenDenom[counter]
      ]?.coinDecimals;
    arr.push({
      amount: (Number(amount[counter]) * Math.pow(10, coinDecimals)).toString(),
      denom: tokenDenom[counter],
    });
    props.setBountyAmount(arr);
    setCounter(counter + 1);
    setIsAddingNewToken(false);
    ref1.current.value = "";
    ref2.current.value = "select-token";
  };

  const handleDelete = (index) => {
    let arr = tokenDenom;
    arr.splice(index, 1);
    setTokenDenom([...arr]);
    arr = amount;
    arr.splice(index, 1);
    setAmount([...arr]);
    arr = props.bountyAmount;
    arr.splice(index, 1);
    props.setBountyAmount([...arr]);
    setCounter(counter - 1);
  };

  const handleAdd = (expiry = 0) => {
    props.setBountyExpiry(expiry);
    setClick(true);
  };
  const handleAmountOnChange = (value) => {
    const array = amount.slice();
    array[counter] = value;
    console.log(array);
    setAmount(array);
  };

  const handleTokenDenomOnChange = (value) => {
    const array = tokenDenom.slice();
    array[counter] = value;
    setTokenDenom(array);
  };

  const handleMaxAmountOnChange = (denom) => {
    const i = balances.map((object) => object.denom).indexOf(denom);
    const array = maxAmount.slice();
    array[counter] = balances[i]?.amount;
    setMaxAmount(array);
  };
  function fillAmount(amount) {
    document.getElementById("amount").value = amount;
  }
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
    if (tokenDenom[counter] !== undefined) {
      let balance = maxAmount[counter];
      let coinDecimals =
        coingeckoId[
          tokenDenom[counter].includes("ibc")
            ? tokenKV[tokenDenom[counter]].denom
            : tokenDenom[counter]
        ]?.coinDecimals;

      if (
        Vamount > 0 &&
        isNaturalNumber(Vamount * Math.pow(10, coinDecimals))
      ) {
        if (Vamount > balance) {
          setValidateAmountError("Insufficient Balance");
        }
      } else {
        setValidateAmountError("Enter a Valid Amount");
      }
    }
  };
  return (
    <div className={props.issue ? "ml-auto" : "flex mt-4 mb-4 text-xs"}>
      {props.issue ? (
        <label
          className="ml-auto btn btn-primary text-xs btn-sm modal-button"
          htmlFor="my-modal"
          data-test="new_bounty"
          onClick={() => {
            setAmount([]);
            setCounter(0);
            setTokenDenom([]);
            setMaxAmount([]);
            props.setBountyAmount([]);
            let da = dayjs().add(7, "D").format("YYYY-MM-DD");
            setExpiry(da);
            // ref3.current.value = da;
            ref2.current.value = "select-token";
            ref1.current.value = "";
            setValidateAmountError(null);
          }}
        >
          NEW BOUNTY
        </label>
      ) : (
        <div className="flex">
          {click ? (
            <div className="flex">
              {props.bountyAmount.length ? (
                <label
                  htmlFor="my-modal"
                  className={
                    "flex link link-primary text-xs no-underline font-bold mx-2"
                  }
                >
                  <div className="flex items-center">
                    <div className="mr-2 font-bold text-white">BOUNTY</div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M14.1211 4.22183L19.7779 9.87869L9.46424 20.1924L3.80738 20.1924L3.80738 14.5355L14.1211 4.22183Z" />
                      <path d="M15.1816 9.5249L11.6461 13.0604" />
                    </svg>
                  </div>
                </label>
              ) : (
                ""
              )}
              {props.bountyAmount.map((a, i) => {
                return (
                  <div className="flex" key={"bounty-token-" + i}>
                    <div
                      className="flex text-xs sm:text-sm uppercase items-center"
                      key={i}
                    >
                      <img
                        src={
                          coingeckoId[
                            a.denom.includes("ibc")
                              ? tokenKV[a.denom].denom
                              : a.denom
                          ].icon
                        }
                        className="py-1 h-4 w-4 sm:h-6 sm:w-6"
                      />
                      <div className="mx-1">
                        {tokenKV[a.denom].standardDenom}
                      </div>
                      <div>
                        {a.amount /
                          Math.pow(
                            10,
                            coingeckoId[
                              a.denom.includes("ibc")
                                ? tokenKV[a.denom].denom
                                : a.denom
                            ].coinDecimals
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {props.bountyExpiry !== "" ? (
                <div className="flex text-xs sm:text-sm items-center mx-2">
                  Expires{" "}
                  {dayjs(props.bountyExpiry * 1000).format("MMM D, YYYY")}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <label
              className="link link-primary no-underline modal-button ml-2"
              htmlFor="my-modal"
            >
              <div className="flex items-center" data-test="attach_bounty">
                <div className="mr-2 font-bold text-white">ATTACH BOUNTY</div>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 0V10" stroke="#66CE67" strokeWidth="2" />
                  <path
                    d="M10 5L-3.57628e-07 5"
                    stroke="#66CE67"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </label>
          )}
        </div>
      )}

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box relative bg-grey-500 min-h-[20rem]">
          <div className="flex mb-4">
            <div className="flex-1 font-bold text-lg text-type">
              Attach Bounty
            </div>
            <label
              htmlFor="my-modal"
              className="btn btn-circle btn-sm btn-ghost"
              onClick={() => {
                setAmount([]);
                setCounter(0);
                setTokenDenom([]);
                setMaxAmount([]);
                props.setBountyAmount([]);
                let da = dayjs().add(7, "D").format("YYYY-MM-DD");
                setExpiry(da);
                // ref3.current.value = da;
                ref2.current.value = "select-token";
                ref1.current.value = "";
                setValidateAmountError(null);
                setDollarValue(0);
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

          {props.bountyAmount.length > 0 ? (
            <div>
              <div className="font-bold uppercase text-type-tertiary text-xs mt-4 ml-1">
                Tokens added (Multiple allowed)
              </div>
              <div className="grid gap-2 grid-flow-col">
                {props.bountyAmount.map((a, i) => {
                  return (
                    <div className="flex" key={"bounty-token-staged-" + i}>
                      <div
                        className={
                          "flex text-xs sm:text-sm bg-grey-900 mr-2 px-2 py-1 rounded-lg uppercase mt-2 items-center"
                        }
                      >
                        <img
                          src={
                            coingeckoId[
                              a.denom.includes("ibc")
                                ? tokenKV[a.denom].denom
                                : a.denom
                            ].icon
                          }
                          className="py-1 h-8 w-8 sm:h-10 sm:w-10"
                        />
                        <div className="ml-2 mr-2">
                          {tokenKV[a.denom].standardDenom}
                        </div>
                        <div>
                          {a.amount /
                            Math.pow(
                              10,
                              coingeckoId[
                                a.denom.includes("ibc")
                                  ? tokenKV[a.denom].denom
                                  : a.denom
                              ].coinDecimals
                            )}
                        </div>
                        <div
                          className="btn btn-sm btn-circle btn-outline border-none ml-2"
                          onClick={() => {
                            handleDelete(i);
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L11 11"
                              stroke="#3E4051"
                              strokeWidth="2"
                            />
                            <path
                              d="M1 11L11 1"
                              stroke="#3E4051"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end">
                  <button
                    className={
                      "flex link link-primary text-xs no-underline uppercase font-bold mt-8 mr-2"
                    }
                    onClick={() => {
                      setIsAddingNewToken(!isAddingNewToken);
                    }}
                  >
                    {isAddingNewToken ? (
                      <span>Cancel</span>
                    ) : (
                      <span>Add Token</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className={
              "bg-grey-900 shadow-xl rounded-lg transition-all" +
              (isAddingNewToken
                ? " p-4 mt-4 h-44 opacity-100"
                : " h-0 opacity-0 pointer-events-none")
            }
          >
            <div>
              <div className="flex mb-2">
                <select
                  className="select text-xs sm:text-sm w-28 sm:w-fit sm:max-w-xs ml-auto h-6 sm:h-10"
                  onChange={async (e) => {
                    handleTokenDenomOnChange(e.target.value);
                    handleMaxAmountOnChange(e.target.value);
                    await getDollarValue(e.target.value, amount[counter]);
                  }}
                  ref={ref2}
                  defaultValue="select-token"
                  data-test="select_token"
                >
                  <option value="select-token">Select Token</option>
                  {balances.map((t, i) => {
                    return !tokenDenom.includes(t.denom) ? (
                      <option key={"token-" + i} value={t.denom}>
                        {t.showDenom}
                      </option>
                    ) : (
                      <option
                        key={"token-" + i}
                        value={t.denom}
                        disabled={true}
                        //data-test={`token_option_${i}`}
                      >
                        {t.showDenom}
                      </option>
                    );
                  })}
                </select>
                <div>
                  <input
                    className="appearance-none bg-transparent border-none w-full text-gray-200 mr-3 py-2 leading-tight focus:outline-none sm:text-2xl font-bold text-right"
                    type="text"
                    placeholder="Enter Amount"
                    aria-label="Amount"
                    ref={ref1}
                    id="amount"
                    data-type="amount_entered"
                    onKeyUp={async (e) => {
                      await validateAmount(e.target.value);
                      await getDollarValue(tokenDenom[counter], e.target.value);
                    }}
                    onKeyDown={async (e) => {
                      await validateAmount(e.target.value);
                      await getDollarValue(tokenDenom[counter], e.target.value);
                    }}
                    onChange={async (e) => {
                      handleAmountOnChange(e.target.value);
                      await getDollarValue(tokenDenom[counter], e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flex">
                <div className="flex text-grey-200 min-h-[24px] items-center">
                  {ref2?.current?.value !== "select-token" ? (
                    <div className="flex flex-none ml-1">
                      <div className="text-xs mr-1">Balance:</div>
                      <div className="text-xs mr-2">{maxAmount[counter]}</div>
                      <div
                        className="link link-primary text-xs text-primary font-bold no-underline mr-2"
                        onClick={async (e) => {
                          fillAmount(maxAmount[counter] * 0.5);
                          handleAmountOnChange(maxAmount[counter] * 0.5);
                          await getDollarValue(
                            tokenDenom[counter],
                            maxAmount[counter] * 0.5
                          );
                        }}
                      >
                        Half
                      </div>
                      <div
                        className="link link-primary text-xs text-primary font-bold no-underline mr-2"
                        onClick={async (e) => {
                          fillAmount(maxAmount[counter]);
                          handleAmountOnChange(maxAmount[counter]);
                          await getDollarValue(
                            tokenDenom[counter],
                            maxAmount[counter]
                          );
                        }}
                      >
                        Max
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex-1"></div>
                  {validateAmountError ? (
                    <label>
                      <span className="label-text-alt text-error">
                        {validateAmountError}
                      </span>
                    </label>
                  ) : (
                    ""
                  )}
                </div>
                <div className="ml-auto font-bold text-xs text-type-tertiary">
                  ≈${dollarValue}
                </div>
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                className={"btn btn-secondary btn-block"}
                onClick={handleClick}
                data-type="add_token"
                disabled={
                  amount[counter] == undefined ||
                  tokenDenom[counter] == undefined ||
                  validateAmountError !== null
                }
              >
                ADD TOKEN TO BOUNTY
              </button>
            </div>
          </div>
          <div className="w-full bg-grey-900 shadow-xl mt-6 rounded-lg">
            <div className="">
              <div className="flex items-center">
                <div className="pl-3">
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
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 2V5"
                      stroke="#E5EDF5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 7.5C3 6.43913 3.42143 5.42172 4.17157 4.67157C4.92172 3.92143 5.93913 3.5 7 3.5H17C18.0609 3.5 19.0783 3.92143 19.8284 4.67157C20.5786 5.42172 21 6.43913 21 7.5V18C21 19.0609 20.5786 20.0783 19.8284 20.8284C19.0783 21.5786 18.0609 22 17 22H7C5.93913 22 4.92172 21.5786 4.17157 20.8284C3.42143 20.0783 3 19.0609 3 18V7.5Z"
                      stroke="#E5EDF5"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 9H21"
                      stroke="#E5EDF5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-none text-sm ml-2">Expiry Date</div>
                <input
                  type="date"
                  data-type="expiry_date"
                  className="flex-1 p-3.5 appearance-none bg-transparent border-none leading-tight focus:outline-none ml-auto text-grey-200 text-sm text-right"
                  value={expiry}
                  min={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) => {
                    setExpiry(dayjs(e.target.valueAsDate).format("YYYY-MM-DD"));
                  }}
                ></input>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="modal-action w-full">
              <label
                htmlFor="my-modal"
                className="btn btn-primary btn-block"
                data-type="attach_bounty"
                onClick={(e) => {
                  props.issue
                    ? props
                        .createBounty(
                          apiClient,
                          cosmosBankApiClient,
                          cosmosFeegrantApiClient,
                          props.bountyAmount,
                          dayjs(expiry.toString()).unix(),
                          props.issue.iid,
                          "issue",
                          props.repository.id
                        )
                        .then((res) => {
                          setAmount([]);
                          setCounter(0);
                          setTokenDenom([]);
                          setMaxAmount([]);
                          props.setBountyAmount([]);
                          // setExpiry("");
                          // ref3.current.value = "dd/mm/yyyy";
                          ref2.current.value = "select-token";
                          ref1.current.value = "";
                          setValidateAmountError(null);
                          setDollarValue(0);
                          if (res && res.code === 0) {
                            props.onUpdate() ? props.onUpdate() : "";
                          }
                        })
                    : handleAdd(dayjs(expiry.toString()).unix());

                  // setAmount([]);
                  // setCounter(1);
                  // setTokenDenom([]);
                  // setMaxAmount([]);
                  // setExpiry("");
                }}
                disabled={
                  props.bountyAmount.length == 0 ||
                  expiry == "" ||
                  expiry == "dd/mm/yyyy"
                }
              >
                ATTACH BOUNTY
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    advanceUser: state.user.advanceUser,
    balance: state.wallet.balance,
  };
};

export default connect(mapStateToProps, {
  createBounty,
})(CreateBounty);
