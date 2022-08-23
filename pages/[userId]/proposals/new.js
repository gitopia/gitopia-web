import Head from "next/head";
import Header from "../../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import { submitGovernanceProposal } from "../../../store/actions/proposals";
import { chainUpgradeProposal } from "../../../store/actions/proposals";
import MarkdownEditor from "../../../components/markdownEditor";
import { communityPoolSpendProposal } from "../../../store/actions/proposals";
import { paramChangeProposal } from "../../../store/actions/proposals";
import getOrganization from "../../../helpers/getOrganization";
import getUser from "../../../helpers/getUser";
import PublicTabs from "../../../components/dashboard/publicTabs";

function RepositoryProposalCreateView(props) {
  const [validateAddressError, setValidateAddressError] = useState("");
  const validAddress = new RegExp("gitopia[a-z0-9]{39}");
  const [validateAmountError, setValidateAmountError] = useState("");
  const [validateInitialAmountError, setValidateInitialAmountError] =
    useState("");
  const [validateTitleError, setValidateTitleError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proposalType, setProposalType] = useState("1");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [height, setHeight] = useState("");
  const [releaseVersionTag, setReleaseVersionTag] = useState("");
  const [paramSubspaces, setParamSubspaces] = useState([""]);
  const [paramKeys, setParamKeys] = useState([""]);
  const [paramValues, setParamValues] = useState([""]);
  const [menuState, setMenuState] = useState(1);
  const [counter, setCounter] = useState(1);
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });

  useEffect(async () => {
    console.log(router.query.userId);
    const o = await getOrganization(router.query.userId);
    if (o) {
      setOrg(o);
    }
  }, [router.query]);
  const hrefBase = "/" + org.address;
  const letter = org.id ? org.name.slice(0, 1) : "x";
  const avatarLink =
    process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === org.address
      ? "/logo-g.svg"
      : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
        letter;

  const validateTitle = async (title) => {
    setValidateTitleError(null);
    if (title.length < 3) {
      setValidateTitleError("Title too short");
    }
  };

  const validateUserAddress = async (address) => {
    if (address.trim() !== "" && validAddress.test(address)) {
      const res = await getUser(address);
      setValidateAddressError(null);
    } else {
      setValidateAddressError("Enter a valid address");
    }
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
      setValidateAmountError("Enter a valid amount");
    }

    // let balance = props.loreBalance;
    if (props.advanceUser === false) {
      Vamount = Vamount * 1000000;
    }
    if (!isNaturalNumber(Vamount)) {
      // if (Vamount > balance) {
      //   setValidateAmountError("Insufficient Balance");
      // }
      // } else {
      setValidateAmountError("Enter a valid amount");
    }
  };

  const validateInitialAmount = async (amount) => {
    setValidateInitialAmountError(null);
    let Vamount = Number(amount);
    if (amount == "") {
      setValidateInitialAmountError("Enter a valid amount");
    }
    let balance = props.loreBalance;
    if (props.advanceUser === false) {
      Vamount = Vamount * 1000000;
    }
    if (Vamount >= 0 && isNaturalNumber(Vamount)) {
      if (Vamount > balance) {
        setValidateInitialAmountError("Insufficient balance");
      }
    } else {
      setValidateInitialAmountError("Enter a valid amount");
    }
  };

  const handleClick = () => {
    setCounter(counter + 1);
    let array = paramSubspaces.slice();
    array.push(undefined);
    setParamSubspaces(array);

    array = paramKeys.slice();
    array.push(undefined);
    setParamKeys(array);

    array = paramValues.slice();
    array.push(undefined);
    setParamValues(array);
  };

  const handleParamSubspaceOnChange = (subspace, index) => {
    const array = paramSubspaces.slice();
    array[index] = subspace;
    setParamSubspaces(array);
  };

  const handleParamKeyOnChange = (key, index) => {
    const array = paramKeys.slice();
    array[index] = key;
    setParamKeys(array);
  };

  const handleParamValueOnChange = (value, index) => {
    const array = paramValues.slice();
    array[index] = value;
    setParamValues(array);
  };

  const redirectToProposal = async (res) => {
    let result = JSON.parse(res.rawLog);
    if (res && res.code === 0) {
      console.log(router);
      router.push(
        hrefBase + "/proposals/" + result[0].events[4].attributes[0].value
      );
    }
  };

  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia Proposals</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1">
        <main className="container mx-auto max-w-screen-lg px-4 py-12">
          <div className="flex flex-1 mb-8">
            <div className="avatar flex-none mr-8 items-center">
              <div className={"w-14 h-14 rounded-full"}>
                <img src={avatarLink} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-md">{org.name}</div>
              <div className="text-sm text-type-secondary mt-2">
                {org.description}
              </div>
            </div>
          </div>
          <div className="flex flex-1 mt-8 border-b border-grey">
            <PublicTabs
              active="proposals"
              hrefBase={hrefBase}
              showPeople={true}
              showProposal={
                process.env.NEXT_PUBLIC_GITOPIA_ADDRESS.toString() ===
                  router.query.userId && org.address
              }
            />
          </div>

          <div className="mt-4">
            <div className="">
              <Link href={hrefBase + "/proposals"}>
                <label className="flex link text-sm uppercase no-underline items-center hover:text-green mt-8">
                  <svg
                    width="8"
                    height="11"
                    viewBox="0 0 8 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                  >
                    <path d="M7 1L2 5.5L7 10" stroke-width="2" />
                  </svg>
                  <span className="ml-2">BACK</span>
                </label>
              </Link>
            </div>
            <div className="mt-4">
              <h1 className="mb-4 text-3xl"> Write your proposal</h1>
              <h1 className="mb-6 text-sm text-type-secondary">
                Proposals play a vital role in the functioning of decentralised
                applications. Any changes or upgrades are done only after
                proposals are voted in consensus. But there is no standard
                category to distinguish different types of proposals. Having a
                clear category will help communities to easily manage different
                types of proposals.
              </h1>
              <div className="flex">
                <div className="form-control w-1/2 mb-4">
                  <label className="label">
                    <span className="label-text text-sm">TITLE</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Write title here"
                    className="input input-md input-bordered text-xs h-8"
                    value={title}
                    onKeyUp={async (e) => {
                      await validateTitle(e.target.value);
                    }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  {validateTitleError ? (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {validateTitleError}
                      </span>
                    </label>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-control mb-4 ml-4 w-1/2">
                  <label className="label">
                    <span className="label-text text-sm">PROPOSAL TYPE</span>
                  </label>
                  <select
                    className="select select-bordered select-sm text-xs h-8"
                    value={proposalType}
                    onChange={(e) => {
                      setProposalType(e.target.value);
                      setMenuState(e.target.value);
                      setAmount("");
                      setAddress("");
                      setHeight("");
                      setReleaseVersionTag("");
                      setParamSubspaces([]);
                      setParamKeys([]);
                      setParamValues([]);
                      setCounter(1);
                    }}
                  >
                    <option value="1">
                      Other Governance Proposal/Governance
                    </option>
                    <option value="2">Development Proposal</option>
                    <option value="3">Chain Upgrade Proposal </option>
                    <option value="4">Chain parameters Change</option>
                    <option value="5">
                      Token Distribution/Budget Allocation
                    </option>
                  </select>
                </div>
              </div>
              <label className="label">
                <span className="label-text text-sm">YOUR PROPOSAL</span>
              </label>
              <div className="border border-grey rounded flex-1 p-4">
                <MarkdownEditor
                  property="text-xs"
                  placeholder="Enter Proposal Description"
                  value={description}
                  setValue={setDescription}
                />
              </div>
              <div className="form-control mt-4 mb-4 w-1/2">
                <label className="label">
                  <span className="label-text text-sm">INITIAL AMOUNT</span>
                </label>
                <div className="form-control mb-4">
                  <input
                    name="initial amount"
                    type="number"
                    placeholder="Enter amount"
                    onKeyUp={async (e) => {
                      await validateInitialAmount(e.target.value);
                    }}
                    onMouseUp={async (e) => {
                      await validateInitialAmount(e.target.value);
                    }}
                    className="input input-md input-bordered text-xs h-8"
                    value={initialDeposit}
                    onChange={(e) => {
                      setInitialDeposit(e.target.value);
                    }}
                  />
                  {validateInitialAmountError ? (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {validateInitialAmountError}
                      </span>
                    </label>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {(menuState == 2 || menuState == 5) && (
                <div className="container mx-auto max-w-screen-lg">
                  <div className="form-control mt-4 mb-4 w-1/2">
                    <label className="label">
                      <span className="label-text text-sm">TOKEN AMOUNT</span>
                    </label>
                    <div className="form-control mb-4">
                      <input
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        onKeyUp={async (e) => {
                          await validateAmount(e.target.value);
                        }}
                        onMouseUp={async (e) => {
                          await validateAmount(e.target.value);
                        }}
                        className="input input-md input-bordered text-xs h-8"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                        }}
                      />
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
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text text-sm">WALLET ADDRESS</span>
                    </label>
                    <div className="form-control mb-4">
                      <input
                        name="Wallet Address"
                        type="text"
                        placeholder="Enter wallet address"
                        onKeyUp={async (e) => {
                          await validateUserAddress(e.target.value);
                        }}
                        className="input input-md input-bordered text-xs h-8"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                      />
                      {validateAddressError ? (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {validateAddressError}
                          </span>
                        </label>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="mt-10 text-right">
                    <div className="inline-block w-36">
                      <button
                        className={
                          "btn btn-sm btn-primary btn-block h-8 text-xs " +
                          (loading ? "loading" : "")
                        }
                        disabled={
                          description === "" ||
                          amount === "" ||
                          address === "" ||
                          title.length < 3 ||
                          initialDeposit === "" ||
                          loading
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .communityPoolSpendProposal(
                              title,
                              description,
                              proposalType,
                              address,
                              props.advanceUser === true
                                ? amount.toString()
                                : (amount * 1000000).toString(),
                              props.advanceUser === true
                                ? initialDeposit.toString()
                                : (initialDeposit * 1000000).toString()
                            )
                            .then((res) => {
                              if (res && res.code === 0) {
                                setDescription("");
                                setAddress("");
                                setAmount("");
                                setTitle("");
                                setInitialDeposit(0);
                                redirectToProposal(res);
                              }
                              setLoading(false);
                            });
                        }}
                      >
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {menuState == 3 && (
                <div className="container mx-auto max-w-screen-lg">
                  <div className="form-control w-1/2 mt-4">
                    <label className="label">
                      <span className="label-text text-sm">
                        RELEASE VERSION TAG:
                      </span>
                    </label>
                    <div className="form-control">
                      <input
                        name="release version tag"
                        type="text"
                        placeholder="Write here the target release:e.g v1.4.2"
                        className="input input-md input-bordered mb-4 text-xs h-8"
                        value={releaseVersionTag}
                        onChange={(e) => {
                          setReleaseVersionTag(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text text-sm">
                        CHAIN UPGRADE HEIGHT:
                      </span>
                    </label>
                    <div className="form-control">
                      <input
                        name="chain upgrade height"
                        type="text"
                        placeholder="Write here the block halt height or chain upgrade height: e.g 104032"
                        className="input input-md input-bordered mb-4 text-xs h-8"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-10 text-right">
                    <div className="inline-block w-36">
                      <button
                        className={
                          "btn btn-sm btn-primary btn-block h-8 text-xs " +
                          (loading ? "loading" : "")
                        }
                        disabled={
                          description === "" ||
                          releaseVersionTag === "" ||
                          height === "" ||
                          title.length < 3 ||
                          initialDeposit === "" ||
                          loading
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .chainUpgradeProposal(
                              title,
                              description,
                              proposalType,
                              releaseVersionTag,
                              height,
                              props.advanceUser === true
                                ? initialDeposit.toString()
                                : (initialDeposit * 1000000).toString()
                            )
                            .then((res) => {
                              if (res && res.code === 0) {
                                setTitle("");
                                setDescription("");
                                setReleaseVersionTag("");
                                setHeight("");
                                setInitialDeposit(0);
                                redirectToProposal(res);
                              }
                              setLoading(false);
                            });
                        }}
                      >
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {menuState == 4 && (
                <div>
                  <div>
                    <label className="label mt-4 ">
                      <span className="label-text text-sm">PARAMETERS</span>
                    </label>
                  </div>
                  {Array.from(Array(counter)).map((c, index) => {
                    return (
                      <div className="flex">
                        <div className="form-control mr-3">
                          <input
                            name="subspace"
                            type="text"
                            placeholder="subspace"
                            className="input input-md input-bordered mb-4 text-xs h-8"
                            value={paramSubspaces[index]}
                            key={"s-" + index}
                            onChange={(e) => {
                              handleParamSubspaceOnChange(
                                e.target.value,
                                index
                              );
                            }}
                          />
                        </div>
                        <div className="form-control mr-3">
                          <input
                            name="key"
                            type="text"
                            placeholder="key"
                            className="input input-md input-bordered mb-4 text-xs h-8"
                            value={paramKeys[index]}
                            key={"k-" + index}
                            onChange={(e) => {
                              handleParamKeyOnChange(e.target.value, index);
                            }}
                          />
                        </div>
                        <div className="form-control w-96">
                          <input
                            name="value"
                            type="text"
                            placeholder="value"
                            className="input input-md w-full input-bordered mb-4 text-xs h-8"
                            value={paramValues[index]}
                            key={"v-" + index}
                            onChange={(e) => {
                              handleParamValueOnChange(e.target.value, index);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-6 text-right">
                    <div className="inline-block w-36">
                      <button
                        className={
                          "btn btn-xs btn-primary btn-block h-5 w-32 " +
                          (false ? "loading" : "")
                        }
                        disabled={false}
                        onClick={handleClick}
                      >
                        ADD PARAMETER
                      </button>
                    </div>
                  </div>
                  <div className="mt-10 text-right">
                    <div className="inline-block w-36">
                      <button
                        className={
                          "btn btn-sm btn-primary btn-block h-8 text-xs " +
                          (loading ? "loading" : "")
                        }
                        disabled={
                          description === "" ||
                          title.length < 3 ||
                          initialDeposit === "" ||
                          paramSubspaces.length === 0 ||
                          paramKeys.length === 0 ||
                          paramValues.length === 0 ||
                          loading
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .paramChangeProposal(
                              title,
                              description,
                              proposalType,
                              paramSubspaces,
                              paramKeys,
                              paramValues,
                              props.advanceUser === true
                                ? initialDeposit.toString()
                                : (initialDeposit * 1000000).toString()
                            )
                            .then((res) => {
                              if (res && res.code === 0) {
                                setTitle("");
                                setDescription("");
                                setInitialDeposit(0);
                                redirectToProposal(res);
                              }
                              setLoading(false);
                            });
                        }}
                      >
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {menuState == 1 && (
                <div className="mt-6 text-right">
                  <div className="inline-block w-36">
                    <button
                      className={
                        "btn btn-sm btn-primary btn-block h-8 text-xs " +
                        (loading ? "loading" : "")
                      }
                      disabled={
                        description === "" ||
                        title.length < 3 ||
                        initialDeposit === "" ||
                        loading
                      }
                      onClick={(e) => {
                        setLoading(true);
                        props
                          .submitGovernanceProposal(
                            title,
                            description,
                            proposalType,
                            props.advanceUser === true
                              ? initialDeposit.toString()
                              : (initialDeposit * 1000000).toString()
                          )
                          .then((res) => {
                            if (res && res.code === 0) {
                              setTitle("");
                              setDescription("");
                              setInitialDeposit(0);
                              redirectToProposal(res);
                            }
                            setLoading(false);
                          });
                      }}
                    >
                      Submit Proposal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    advanceUser: state.user.advanceUser,
    loreBalance: state.wallet.loreBalance,
    dashboards: state.user.dashboards,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, {
  submitGovernanceProposal,
  chainUpgradeProposal,
  communityPoolSpendProposal,
  paramChangeProposal,
})(RepositoryProposalCreateView);
