import Head from "next/head";
import Header from "../../../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import { submitGovernanceProposal } from "../../../../store/actions/proposals";
import { chainUpgradeProposal } from "../../../../store/actions/proposals";
import MarkdownEditor from "../../../../components/markdownEditor";
import { communityPoolSpendProposal } from "../../../../store/actions/proposals";
import getOrganization from "../../../../helpers/getOrganization";
import getRepository from "../../../../helpers/getRepository";
import getUser from "../../../../helpers/getUser";

function RepositoryProposalCreateView(props) {
  const [validateAddressError, setValidateAddressError] = useState("");
  const validAddress = new RegExp("gitopia[a-z0-9]{39}");
  const [validateAmountError, setValidateAmountError] = useState("");

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
      setValidateAmountError("Enter Valid Amount");
    }

    let balance = props.loreBalance;
    if (props.advanceUser === false) {
      Vamount = Vamount * 1000000;
    }
    if (Vamount > 0 && isNaturalNumber(Vamount)) {
      if (Vamount > balance) {
        setValidateAmountError("Insufficient Balance");
      }
    } else {
      setValidateAmountError("Enter a Valid Amount");
    }
  };

  const handleClick = () => {
    setCounter(counter + 1);
  };

  const handleValueOnChange = (e) => {
    const temp = {};
    temp[e.target.className] = e.target.value;
    setParameterValue({ ...parameterValue, ...temp });
  };

  const handleNameOnChange = (e) => {
    const temp = {};
    temp[e.target.className] = e.target.value;
    setParameterName({ ...parameterName, ...temp });
  };

  const router = useRouter();
  const hrefBase = "/" + router.query.orgId;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proposalType, setProposalType] = useState("1");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [height, setHeight] = useState("");
  const [releaseVersionTag, setReleaseVersionTag] = useState("");
  const [parameterName, setParameterName] = useState({});
  const [parameterValue, setParameterValue] = useState({});
  const [menuState, setMenuState] = useState(1);
  const [counter, setCounter] = useState(1);
  const [paramNames, setParamNames] = useState([
    "account_number",
    "address",
    "pub_key",
  ]);

  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });

  useEffect(async () => {
    const o = await getOrganization(router.query.orgId);
    if (o) {
      setOrg(o);
    }
  }, [router.query]);

  const redirectToProposal = async (res) => {
    if (res.code === 0) {
      router.push("/daos/" + router.query.orgId + "/proposals");
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
      <div
        data-theme="dark"
        className="flex flex-col bg-base-100 text-base-content min-h-screen"
      >
        <main className="container mx-auto max-w-screen-lg">
          <div className="flex mt-8 px-4">
            <div className="">
              <Link href={hrefBase + "/proposals"}>
                <label className="flex link text-sm uppercase no-underline items-center hover:text-green pt-16">
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

            <div className="flex-1 p-4 pt-24 px-36">
              <h1 className="mb-4 text-lg"> Write your proposal</h1>
              <h1 className="mb-6 text-sm">
                Proposals play a vital role in the functioning of decentralised
                applications. Any changes or upgrades are done only after
                proposals are voted in consensus. But there is no standard
                category to distinguish different types of proposals. Having a
                clear category will help communities to easily manage different
                types of proposals.
              </h1>
              <div className="flex">
                <div className="form-control w-1/2">
                  <label className="label">
                    <span className="label-text text-sm">TITLE</span>
                  </label>
                  <div className="form-control">
                    <input
                      name="title"
                      type="text"
                      placeholder="Write title here"
                      className="input input-md input-bordered mb-4 text-xs h-8"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
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
                      setParameterName({});
                      setParameterValue({});
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
                          title === ""
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
                                : (amount * 1000000).toString()
                            )
                            .then((res) => {
                              setLoading(false);
                              setDescription("");
                              setAddress("");
                              setAmount("");
                              setTitle("");
                              redirectToProposal(res);
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
                          title === ""
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .chainUpgradeProposal(
                              title,
                              description,
                              proposalType,
                              releaseVersionTag,
                              height
                            )
                            .then((res) => {
                              setLoading(false);
                              setTitle("");
                              setDescription("");
                              setReleaseVersionTag("");
                              setHeight("");
                              redirectToProposal(res);
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
                      <span className="label-text text-sm">PARAMETER NAME</span>
                    </label>
                  </div>
                  {Array.from(Array(counter)).map((c, index) => {
                    return (
                      <div className="flex" id="param">
                        <div className="form-control w-1/2">
                          <select
                            className={
                              "select select-bordered select-md text-xs" + index
                            }
                            value={
                              parameterName[
                                "input input-md input-bordered mb-4 text-xs" +
                                  index
                              ]
                            }
                            key={c}
                            onChange={handleNameOnChange}
                          >
                            {paramNames.map((i) => {
                              return (
                                <option value={i} key={i}>
                                  {i}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="form-control ml-4 w-1/2">
                          <input
                            name="parameter value"
                            key={c}
                            className={
                              "input input-md input-bordered mb-4 text-xs" +
                              index
                            }
                            value={
                              parameterValue[
                                "input input-md input-bordered mb-4 text-xs" +
                                  index
                              ]
                            }
                            type="text"
                            placeholder="value"
                            onChange={handleValueOnChange}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-6 text-right">
                    <div className="inline-block w-36">
                      <button
                        className={
                          "btn btn-sm btn-primary btn-block h-8 " +
                          (false ? "loading" : "")
                        }
                        disabled={true}
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
                          true
                          /* description === "" ||
                          parameterName === {} ||
                          parameterValue === {} ||
                          title === "" */
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .submitGovernanceProposal(
                              title,
                              description,
                              proposalType
                            )
                            .then((res) => {
                              setLoading(false);
                              setTitle("");
                              setDescription("");
                              redirectToProposal(res);
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
                      disabled={description === "" || title === ""}
                      onClick={(e) => {
                        setLoading(true);
                        props
                          .submitGovernanceProposal(
                            title,
                            description,
                            proposalType
                          )
                          .then((res) => {
                            setLoading(false);
                            setTitle("");
                            setDescription("");
                            redirectToProposal(res);
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
    repositories: state.organization.repositories,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, {
  submitGovernanceProposal,
  chainUpgradeProposal,
  communityPoolSpendProposal,
})(RepositoryProposalCreateView);
