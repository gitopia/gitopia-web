import Head from "next/head";
import Header from "../../../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import { submitGovernanceProposal } from "../../../../store/actions/proposals";
import { chainUpgradeProposal } from "../../../../store/actions/proposals";
import MarkdownEditor from "../../../../components/markdownEditor";
import { notify } from "reapop";
import { communityPoolSpendProposal } from "../../../../store/actions/proposals";
import getOrganization from "../../../../helpers/getOrganization";
import getRepository from "../../../../helpers/getRepository";
//import {updateUserBalance} from "../../../../store/actions/wallet"

function RepositoryProposalCreateView(props) {
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
  const [repositoryName, setRepositoryName] = useState("");
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
  const [allRepos, setAllRepos] = useState([""]);

  useEffect(async () => {
    const o = await getOrganization(router.query.orgId);
    if (o) {
      setOrg(o);
    }
  }, [router.query]);

  const getAllRepos = async () => {
    if (org.id) {
      const pr = org.repositories.map((r) => getRepository(r.id));
      const repos = await Promise.all(pr);
      setAllRepos(repos.reverse());
    }
  };

  useEffect(getAllRepos, [org]);

  if (repositoryName === "" && allRepos !== []) {
    setRepositoryName(allRepos[0].name);
  }

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
                <div className="form-control mb-4 w-1/2">
                  <label className="label">
                    <span className="label-text text-sm">
                      CHOOSE REPOSITORY
                    </span>
                  </label>
                  <select
                    className="select select-bordered select-sm text-xs h-8"
                    value={repositoryName}
                    onChange={(e) => {
                      setRepositoryName(e.target.value);
                    }}
                  >
                    <option value="none" selected disabled hidden>
                      Select an Repository
                    </option>
                    {allRepos.map((i) => {
                      return (
                        <option value={i.name} key={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
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
                        type="text"
                        placeholder="Enter amount"
                        className="input input-md input-bordered text-xs h-8"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                        }}
                      />
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
                        className="input input-md input-bordered text-xs h-8"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
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
                          amount === "" ||
                          address === "" ||
                          repositoryName === ""
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .communityPoolSpendProposal(
                              repositoryName,
                              description,
                              proposalType,
                              address,
                              amount
                            )
                            .then((res) => {
                              setLoading(false);
                              props.notify("Proposal Submitted", "info");
                              setDescription("");
                              setAddress("");
                              setAmount("");
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
                          repositoryName === ""
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .chainUpgradeProposal(
                              repositoryName,
                              description,
                              proposalType,
                              releaseVersionTag,
                              height
                            )
                            .then((res) => {
                              setLoading(false);
                              props.notify("Proposal Submitted", "info");
                              setDescription("");
                              setReleaseVersionTag("");
                              setHeight("");
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
                            // class="input input-md input-bordered mb-4"
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
                        disabled={description === ""}
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
                          repositoryName === "" */
                        }
                        onClick={(e) => {
                          setLoading(true);
                          props
                            .submitGovernanceProposal(
                              repositoryName,
                              description,
                              proposalType
                            )
                            .then((res) => {
                              props.notify("Proposal Submitted", "info");
                              setLoading(false);
                              setDescription("");
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
                      disabled={description === "" || repositoryName === ""}
                      onClick={(e) => {
                        console.log(repositoryName, description, proposalType);
                        setLoading(true);
                        props
                          .submitGovernanceProposal(
                            repositoryName,
                            description,
                            proposalType
                          )
                          .then((res) => {
                            props.notify("Proposal Submitted", "info");
                            setLoading(false);
                            setDescription("");
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
    dashboards: state.user.dashboards,
    repositories: state.organization.repositories,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, {
  submitGovernanceProposal,
  notify,
  chainUpgradeProposal,
  communityPoolSpendProposal,
})(RepositoryProposalCreateView);
