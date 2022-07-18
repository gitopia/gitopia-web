import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import find from "lodash/find";
import Head from "next/head";

import Header from "../../../../components/header";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import MarkdownEditor from "../../../../components/markdownEditor";
import { createIssue } from "../../../../store/actions/repository";
import { getBalance } from "../../../../store/actions/wallet";
import { updateUserBalance } from "../../../../store/actions/wallet";
import { notify } from "reapop";
import AssigneeSelector from "../../../../components/repository/assigneeSelector";
import LabelSelector from "../../../../components/repository/labelSelector";
import Label from "../../../../components/repository/label";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";
import useRepository from "../../../../hooks/useRepository";
import dayjs from "dayjs";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

function RepositoryIssueCreateView(props) {
  const router = useRouter();
  const { repository } = useRepository();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [labels, setLabels] = useState([]);
  const [postingIssue, setPostingIssue] = useState(false);
  const [allLabels, setAllLabels] = useState([]);
  const [amount, setAmount] = useState(0);
  const [validateAmountError, setValidateAmountError] = useState("");

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

  const validateIssue = () => {
    return true;
  };

  const createIssue = async () => {
    setPostingIssue(true);
    if (validateIssue()) {
      const issue = {
        title,
        description,
        repositoryName: repository.name,
        repositoryOwner: repository.owner.id,
        assignees,
        labels,
      };
      const res = await props.createIssue(issue);
      if (res && res.code === 0) {
        router.push(
          "/" +
            repository.owner.id +
            "/" +
            repository.name +
            "/issues/" +
            (Number(repository.issuesCount) + 1)
        );
      }
    }
    setPostingIssue(false);
  };

  useEffect(() => {
    if (repository) {
      setAllLabels(repository.labels);
    }
  }, [repository.id]);

  const username = props.selectedAddress ? props.selectedAddress.slice(-1) : "";
  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="issues" />
          <div className="sm:flex mt-8">
            <div className="flex flex-1">
              <div className="flex-none mr-4">
                <div className="avatar">
                  <div className="mb-8 rounded-full w-10 h-10">
                    <img
                      src={
                        "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                        username
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="border border-grey rounded flex-1 p-4">
                <div className="form-control mb-4">
                  <input
                    type="text"
                    placeholder="Issue Title"
                    className="input input-md input-bordered"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="flex mt-4 mb-4 text-xs">
                  <div className="mr-2 font-bold">ADD BOUNTY</div>
                  <label
                    htmlFor="my-modal-2"
                    className="link link-primary no-underline mt-1 modal-button"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 0V10" stroke="#66CE67" stroke-width="2" />
                      <path
                        d="M10 5L-3.57628e-07 5"
                        stroke="#66CE67"
                        stroke-width="2"
                      />
                    </svg>
                  </label>
                  <input
                    type="checkbox"
                    id="my-modal-2"
                    className="modal-toggle"
                  />
                  <label htmlFor="my-modal-2" className="modal cursor-pointer">
                    <label className="modal-box relative">
                      <div className="flex mb-4">
                        <div className="w-11/12 font-bold text-sm text-type">
                          Add bounty
                        </div>
                        <label
                          htmlFor="my-modal-2"
                          className="ml-auto hover:opacity-25"
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

                      <div class="card w-full bg-grey-900 shadow-xl mt-4">
                        <div class="card-body p-3">
                          <div className="mb-2 text-grey-200">AMOUNT</div>
                          <div className="flex mb-2">
                            <div>
                              <input
                                class="appearance-none bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none text-2xl font-bold"
                                type="text"
                                placeholder="Enter Amount"
                                aria-label="Full name"
                                onKeyUp={async (e) => {
                                  await validateAmount(e.target.value);
                                }}
                                onChange={(e) => {
                                  setAmount(e.target.value);
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
                            <select className="select w-fit max-w-xs ml-auto h-10">
                              <option disabled selected>
                                Select Token
                              </option>
                              <option>
                                {props.advanceUser === true
                                  ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
                                  : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
                              </option>
                            </select>
                          </div>
                          <div className="flex ml-auto text-grey-200">
                            <div className="text-xs mr-1">Balance:</div>
                            <div className="text-xs mr-2">
                              {props.advanceUser === true
                                ? props.loreBalance
                                : props.loreBalance / 1000000}
                            </div>
                            <div className="link link-primary text-xs text-primary font-bold no-underline">
                              Max
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card w-full bg-grey-900 shadow-xl mt-3">
                        <div class="card-body p-3">
                          <div className="flex">
                            <div className="">
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
                            <div className="flex text-xs mt-1 ml-1.5">
                              Expiry date
                            </div>
                            <div className="flex ml-auto text-grey-200 text-xs">
                              {dayjs().format("DD MMMM YYYY")}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex ml-auto self-center">
                        <div className="modal-action">
                          <label
                            htmlFor="my-modal-2"
                            className="btn w-96 px-56 flex-1 bg-green-900 text-xs ml-1"
                            onClick={(e) => {}}
                            disabled={null}
                          >
                            ADD
                          </label>
                        </div>
                      </div>
                    </label>
                  </label>
                </div>
                <MarkdownEditor value={description} setValue={setDescription} />
                <div className="text-right mt-4">
                  <div className="inline-block w-36">
                    <button
                      className={
                        "btn btn-sm btn-primary btn-block " +
                        (postingIssue ? "loading" : "")
                      }
                      disabled={title.trim().length === 0 || postingIssue}
                      onClick={createIssue}
                    >
                      Create Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-none sm:w-64 sm:pl-8 divide-y divide-grey mt-8 sm:mt-0">
              <div className="w-full pb-8">
                <AssigneeSelector
                  assignees={assignees}
                  collaborators={[
                    { id: repository.owner.address, permission: "CREATOR" },
                    ...repository.collaborators,
                  ]}
                  onChange={async (list) => {
                    setAssignees(list);
                  }}
                />
                <div className="text-xs px-3 mt-2">
                  {assignees.length ? (
                    <AssigneeGroup assignees={assignees} />
                  ) : (
                    "No one"
                  )}
                </div>
              </div>
              <div className="py-8">
                <LabelSelector
                  labels={labels}
                  repoLabels={repository.labels}
                  editLabels={
                    "/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/issues/labels"
                  }
                  onChange={async (list) => {
                    console.log(list);
                    setLabels(list);
                  }}
                />
                <div className="text-xs px-3 mt-2 flex flex-wrap">
                  {labels.length
                    ? labels.map((l, i) => {
                        let label = find(allLabels, { id: l }) || {
                          name: "",
                          color: "",
                        };
                        return (
                          <span
                            className="pr-2 pb-2 whitespace-nowrap"
                            key={"label" + i}
                          >
                            <Label color={label.color} name={label.name} />
                          </span>
                        );
                      })
                    : "None yet"}
                </div>
              </div>
              {/* <div className="py-8">
                <button className="btn btn-sm btn-block btn-ghost">
                  <div className="flex-1 text-left">Linked Pull Requests</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="text-xs px-3 mt-2">None yet</div>
              </div> */}
            </div>
          </div>
        </main>
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
  createIssue,
  getBalance,
  updateUserBalance,
  notify,
})(RepositoryIssueCreateView);
