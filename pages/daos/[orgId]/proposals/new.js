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
//import {updateUserBalance} from "../../../../store/actions/wallet"

function RepositoryProposalCreateView(props) {
  const router = useRouter();
  const hrefBase = "/orgs/" + props.currentDashboard;
  const [repositoryName, setRepositoryName] = useState(
    props.repositories[0].name
  );
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
      <div className="flex">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <div className="flex mt-8 px-4">
            <div className="flex flex-1">
              <div>
                <Link href={hrefBase + "/proposals"}>
                  <button className="btn btn-ghost btn-circle absolute left-40 top-30">
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                </Link>
              </div>

              <div className="flex-1 p-4 pt-36">
                <h1 className="mb-4 text-2xl"> Write your proposal</h1>
                <h1 className="mb-12">
                  Proposals play a vital role in the functioning of
                  decentralised applications. Any changes or upgrades are done
                  only after proposals are voted in consensus. But there is no
                  standard category to distinguish different types of proposals.
                  Having a clear category will help communities to easily manage
                  different types of proposals.
                </h1>
                <div className="flex">
                  <div className="form-control mb-4 w-1/2">
                    <label className="label">
                      <span className="label-text">CHOOSE REPOSITORY</span>
                    </label>
                    <select
                      className="select select-bordered select-md"
                      value={repositoryName}
                      onChange={(e) => {
                        setRepositoryName(e.target.value);
                      }}
                    >
                      {props.repositories.map((i) => {
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
                      <span className="label-text">PROPOSAL TYPE</span>
                    </label>
                    <select
                      className="select select-bordered select-md"
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
                  <span className="label-text">YOUR PROPOSAL</span>
                </label>
                <div className="border border-grey rounded flex-1 p-4">
                  <MarkdownEditor
                    placeholder="Enter Proposal Description"
                    value={description}
                    setValue={setDescription}
                  />
                </div>
                {(menuState == 2 || menuState == 5) && (
                  <div className="container mx-auto max-w-screen-lg">
                    <div className="form-control mt-4 mb-4 w-1/2">
                      <label className="label">
                        <span className="label-text">TOKEN AMOUNT</span>
                      </label>
                      <div className="form-control mb-4">
                        <input
                          name="amount"
                          type="text"
                          placeholder="Enter amount"
                          className="input input-md input-bordered"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">WALLET ADDRESS</span>
                      </label>
                      <div className="form-control mb-4">
                        <input
                          name="Wallet Address"
                          type="text"
                          placeholder="Enter wallet address"
                          className="input input-md input-bordered"
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
                            "btn btn-sm btn-primary btn-block " +
                            (false ? "loading" : "")
                          }
                          disabled={
                            description === "" ||
                            amount === "" ||
                            address === ""
                          }
                          onClick={(e) => {
                            props
                              .communityPoolSpendProposal(
                                repositoryName,
                                description,
                                proposalType,
                                address,
                                amount
                              )
                              .then((res) => {
                                // props.notify("Proposal Submitted", "info");
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
                        <span className="label-text">RELEASE VERSION TAG:</span>
                      </label>
                      <div className="form-control">
                        <input
                          name="release version tag"
                          type="text"
                          placeholder="Write here the target release:e.g v1.4.2"
                          className="input input-md input-bordered mb-4"
                          value={releaseVersionTag}
                          onChange={(e) => {
                            setReleaseVersionTag(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">
                          CHAIN UPGRADE HEIGHT:
                        </span>
                      </label>
                      <div className="form-control">
                        <input
                          name="chain upgrade height"
                          type="text"
                          placeholder="Write here the block halt height or chain upgrade height: e.g 104032"
                          className="input input-md input-bordered mb-4"
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
                            "btn btn-sm btn-primary btn-block " +
                            (false ? "loading" : "")
                          }
                          disabled={
                            description === "" ||
                            releaseVersionTag === "" ||
                            height === ""
                          }
                          onClick={(e) => {
                            props
                              .chainUpgradeProposal(
                                repositoryName,
                                description,
                                proposalType,
                                releaseVersionTag,
                                height
                              )
                              .then((res) => {
                                // props.updateUserBalance();
                                props.notify("Proposal Submitted", "info");
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
                        <span className="label-text">PARAMETER NAME</span>
                      </label>
                    </div>
                    {Array.from(Array(counter)).map((c, index) => {
                      return (
                        <div className="flex" id="param">
                          <div className="form-control w-1/2">
                            <select
                              className={
                                "select select-bordered select-md" + index
                              }
                              value={
                                parameterName[
                                  "input input-md input-bordered mb-4 " + index
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
                                "input input-md input-bordered mb-4 " + index
                              }
                              value={
                                parameterValue[
                                  "input input-md input-bordered mb-4 " + index
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
                    <div className="mt-10 text-right">
                      <div className="inline-block w-36">
                        <button
                          className={
                            "btn btn-sm btn-primary btn-block " +
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
                            "btn btn-sm btn-primary btn-block " +
                            (false ? "loading" : "")
                          }
                          disabled={
                            description === "" ||
                            parameterName === {} ||
                            parameterValue === {}
                          }
                          onClick={(e) => {
                            props.submitGovernanceProposal(
                              repositoryName,
                              description,
                              proposalType
                            );
                          }}
                        >
                          Submit Proposal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {menuState == 1 && (
                  <div className="mt-10 text-right">
                    <div className="inline-block w-36">
                      <button
                        className={
                          "btn btn-sm btn-primary btn-block " +
                          (false ? "loading" : "")
                        }
                        disabled={description === ""}
                        onClick={(e) => {
                          props
                            .submitGovernanceProposal(
                              repositoryName,
                              description,
                              proposalType
                            )
                            .then((res) => {
                              props.notify("Proposal Submitted", "info");
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
