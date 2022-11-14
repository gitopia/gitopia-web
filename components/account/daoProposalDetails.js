import { useEffect, useState } from "react";
import { connect } from "react-redux";
import getProposal from "../../helpers/getProposal";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { proposalDeposit } from "../../store/actions/proposals";
import { proposalVote } from "../../store/actions/proposals";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import getTally from "../../helpers/getTally";
import Link from "next/dist/client/link";
import getDepositor from "../../helpers/getDepositor";
import getVoter from "../../helpers/getVoter";
import ReactMarkdown from "react-markdown";

function DaoProposalDetails({ id, ...props }) {
  const [amount, setAmount] = useState("");
  const [validateAmountError, setValidateAmountError] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [voteAbstainLoading, setVoteAbstainLoading] = useState(false);
  const [voteNoLoading, setVoteNoLoading] = useState(false);
  const [voteYesLoading, setVoteYesLoading] = useState(false);
  const [voteNoWithVetoLoading, setVoteNoWithVetoLoading] = useState(false);
  const [proposal, setProposal] = useState({ content: { description: "" } });
  const [proposer, setProposer] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [tally, setTally] = useState({});
  const [depositors, setDepositors] = useState([]);
  const [voters, setVoters] = useState([]);
  const router = useRouter();
  const hrefBase = "/" + router.query.userId;
  const type = "@type";
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  const refreshProposal = async () => {
    if (id !== undefined) {
      await getProposal(id).then((res) => {
        if (res !== undefined) {
          setProposal(res.msg);
          setProposer(res.proposer);
          setInitialDeposit(res.initial_deposit);
        } else {
          router.push(router.query.userId + "?tab=proposals");
        }
      });
    }
  };

  const refreshTally = async () => {
    if (id !== undefined) {
      await getTally(id).then((res) => {
        if (res === {}) {
          setTally({
            yes: 0,
            no: 0,
            abstain: 0,
            no_with_veto: 0,
          });
        }
        setTally(res.tally);
      });
    }
  };

  const refreshDepositors = async () => {
    if (id !== undefined) {
      await getDepositor(id).then((res) => {
        if (res !== undefined) {
          setDepositors(res.slice(1, res.length));
        }
      });
    }
  };

  const refreshVoters = async () => {
    if (id !== undefined) {
      await getVoter(id).then((res) => {
        setVoters(res);
      });
    }
  };

  useEffect(() => {
    refreshProposal();
  }, [id]);
  useEffect(() => {
    refreshTally();
  }, [id]);
  useEffect(() => {
    refreshDepositors();
  }, [id]);
  useEffect(() => {
    refreshVoters();
  }, [id]);

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

  function getPercentage(key) {
    if (tally !== undefined) {
      let total =
        parseInt(tally.yes) +
        parseInt(tally.no) +
        parseInt(tally.abstain) +
        parseInt(tally.no_with_veto);
      if (total > 0) {
        let count;
        if (key == "yes") {
          count = parseInt(tally.yes);
        } else if (key == "no") {
          count = parseInt(tally.no);
        } else if (key == "abstain") {
          count = parseInt(tally.abstain);
        } else if (key == "no_with_veto") {
          count = parseInt(tally.no_with_veto);
        }
        let percent = count / total;
        return percent * 100;
      }
    }
    return 0;
  }

  return (
    <>
      <div className="mt-8 pb-4">
        <Link href={hrefBase + "?tab=proposals"}>
          <label className="flex link text-sm uppercase no-underline items-center hover:text-green">
            <svg
              width="8"
              height="11"
              viewBox="0 0 8 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <path d="M7 1L2 5.5L7 10" strokeWidth="2" />
            </svg>
            <span className="ml-2">BACK</span>
          </label>
        </Link>
      </div>
      {proposal !== undefined ? (
        <div className="">
          <div>
            {proposal.status == "PROPOSAL_STATUS_PASSED" ? (
              <div className="badge badge-success ml-auto h-10 px-6 bg-green-900 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>PASSED</span>
              </div>
            ) : (
              ""
            )}
            {proposal.status == "PROPOSAL_STATUS_REJECTED" ? (
              <div className="badge badge-error ml-auto h-10 px-6 bg-pink text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>REJECTED</span>
              </div>
            ) : (
              ""
            )}
            {proposal.status == "PROPOSAL_STATUS_DEPOSIT_PERIOD" ? (
              <div className="badge badge-info ml-auto h-10 px-6 bg-tertiary text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>AWAITING DEPOSIT</span>
              </div>
            ) : (
              ""
            )}
            {proposal.status == "PROPOSAL_STATUS_VOTING_PERIOD" ? (
              <div className="badge badge-info ml-auto h-10 px-6 text-white">
                <div className="flex relative top-px w-4 h-4 mr-2 items-center justify-center">
                  <div
                    className={
                      "absolute w-3 h-3 rounded-full bg-teal opacity-75 animate-ping"
                    }
                  ></div>
                  <div className="absolute w-2 h-2 rounded-full bg-teal"></div>
                </div>
                <span>VOTING IN PROGRESS</span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="mt-5 text-3xl">
            <span>{proposal.content.title}</span>
            <span className="ml-4 text-neutral">
              {"#" + proposal.proposal_id}
            </span>
          </div>
          <div className="mt-3 text-type-secondary mb-14">
            {typeof proposal.content !== "undefined" ? (
              <div className="mb-3 markdown-body">
                <ReactMarkdown linkTarget="_blank">
                  {proposal.content.description}
                </ReactMarkdown>
              </div>
            ) : (
              ""
            )}

            {typeof proposal.content !== "undefined" ? (
              proposal.content["@type"] ==
              "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal" ? (
                <div>
                  <div>{"Plan Name: " + proposal.content.plan.name}</div>
                  <div>{"Upgrade Height: " + proposal.content.plan.height}</div>
                  <div>
                    {"Upgraded Client State: " +
                      (proposal.content.plan.upgraded_client_state == null
                        ? "--"
                        : proposal.content.plan.upgraded_client_state)}
                  </div>
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {typeof proposal.content !== "undefined" ? (
              proposal.content["@type"] ==
              "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal" ? (
                <div>
                  <div>{"Recipient: " + proposal.content["recipient"]}</div>
                  <div>
                    {"Amount: " +
                      (props.advanceUser === true
                        ? proposal.content.amount[0].amount
                        : proposal.content.amount[0].amount / 1000000) +
                      " " +
                      (props.advanceUser === true
                        ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                        : process.env.NEXT_PUBLIC_CURRENCY_TOKEN)}
                  </div>
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {typeof proposal.content !== "undefined" ? (
              proposal.content["@type"] ==
              "/cosmos.params.v1beta1.ParameterChangeProposal" ? (
                <div>
                  {proposal.content["changes"].map((change, index) => {
                    return (
                      <div key={"parameterchange" + index}>
                        <div>{"Change " + (index + 1)}</div>
                        <div className="ml-5">
                          <div>{"Subspace: " + change.subspace}</div>
                          <div>{"Key: " + change.key}</div>
                          <div>{"Value: " + change.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>

          {proposal.status == "PROPOSAL_STATUS_DEPOSIT_PERIOD" ? (
            <div className="mt-4">
              <label
                htmlFor="my-modal-2"
                className={
                  "btn btn-primary btn-xs modal-button text-xs h-8 w-36 uppercase ml-auto " +
                  (depositLoading ? "loading" : "")
                }
                disabled={depositLoading}
              >
                Submit Deposit
              </label>
            </div>
          ) : (
            <div className="bg-base-200 rounded-lg p-8">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col items-center">
                  <div style={{ width: 90, height: 90 }}>
                    <CircularProgressbar
                      value={getPercentage("yes")}
                      text={`${getPercentage("yes")}%`}
                      styles={buildStyles({
                        textColor: "#E2EBF2",
                        pathColor: "#66CE67",
                        trailColor: "#3E4051",
                      })}
                    />
                  </div>
                  <button
                    className={
                      "btn btn-outline btn-xs h-8 w-24 text-xs mt-5 " +
                      (voteYesLoading ? "loading" : "")
                    }
                    onClick={(e) => {
                      setVoteYesLoading(true);
                      props.proposalVote(id, "VOTE_OPTION_YES").then((res) => {
                        setVoteYesLoading(false);
                        refreshTally();
                        refreshVoters();
                      });
                    }}
                    disabled={
                      proposal.status !== "PROPOSAL_STATUS_VOTING_PERIOD" ||
                      voteAbstainLoading === true ||
                      voteNoLoading === true ||
                      voteNoWithVetoLoading === true
                    }
                  >
                    YES
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div style={{ width: 90, height: 90 }}>
                    <CircularProgressbar
                      value={getPercentage("no")}
                      text={`${getPercentage("no")}%`}
                      styles={buildStyles({
                        textColor: "#E2EBF2",
                        pathColor: "#E83D99",
                        trailColor: "#3E4051",
                      })}
                    />
                  </div>
                  <button
                    className={
                      "btn btn-outline btn-xs h-8 w-24 text-xs mt-5 " +
                      (voteNoLoading ? "loading" : "")
                    }
                    onClick={(e) => {
                      setVoteNoLoading(true);
                      props.proposalVote(id, "VOTE_OPTION_NO").then((res) => {
                        setVoteNoLoading(false);
                        refreshTally();
                        refreshVoters();
                      });
                    }}
                    disabled={
                      proposal.status !== "PROPOSAL_STATUS_VOTING_PERIOD" ||
                      voteAbstainLoading === true ||
                      voteYesLoading === true ||
                      voteNoWithVetoLoading === true
                    }
                  >
                    NO
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div style={{ width: 90, height: 90 }}>
                    <CircularProgressbar
                      value={getPercentage("abstain")}
                      text={`${getPercentage("abstain")}%`}
                      styles={buildStyles({
                        textColor: "#E2EBF2",
                        pathColor: "#29B7E4",
                        trailColor: "#3E4051",
                      })}
                    />
                  </div>
                  <button
                    className={
                      "btn btn-outline btn-xs h-8 w-24 text-xs mt-5 " +
                      (voteAbstainLoading ? "loading" : "")
                    }
                    onClick={(e) => {
                      setVoteAbstainLoading(true);
                      props
                        .proposalVote(id, "VOTE_OPTION_ABSTAIN")
                        .then((res) => {
                          setVoteAbstainLoading(false);
                          refreshTally();
                          refreshVoters();
                        });
                    }}
                    disabled={
                      proposal.status !== "PROPOSAL_STATUS_VOTING_PERIOD" ||
                      voteNoLoading === true ||
                      voteYesLoading === true ||
                      voteNoWithVetoLoading === true
                    }
                  >
                    ABSTAIN
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div style={{ width: 90, height: 90 }}>
                    <CircularProgressbar
                      value={getPercentage("no_with_veto")}
                      text={`${getPercentage("no_with_veto")}%`}
                      styles={buildStyles({
                        textColor: "#E2EBF2",
                        pathColor: "#C52A7D",
                        trailColor: "#3E4051",
                      })}
                    />
                  </div>
                  <button
                    className={
                      "btn btn-outline btn-xs h-8 w-32 text-xs mt-5 " +
                      (voteNoWithVetoLoading ? "loading" : "")
                    }
                    onClick={(e) => {
                      setVoteNoWithVetoLoading(true);
                      props
                        .proposalVote(id, "VOTE_OPTION_NO_WITH_VETO")
                        .then((res) => {
                          setVoteNoWithVetoLoading(false);
                          refreshTally();
                          refreshVoters();
                        });
                    }}
                    disabled={
                      proposal.status !== "PROPOSAL_STATUS_VOTING_PERIOD" ||
                      voteNoLoading === true ||
                      voteYesLoading === true ||
                      voteAbstainLoading === true
                    }
                  >
                    NO WITH VETO
                  </button>
                </div>
              </div>
            </div>
          )}
          <input type="checkbox" id="my-modal-2" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <div>
                <label className="label">
                  <span className="label-text text-xs font-bold text-gray-400">
                    AMOUNT
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
                <div className="flex ml-auto self-center">
                  <div className="modal-action">
                    <label
                      htmlFor="my-modal-2"
                      className={
                        "btn btn-sm btn-primary flex-1 bg-green-900 " +
                        (depositLoading ? "loading" : "")
                      }
                      onClick={(e) => {
                        setDepositLoading(true);
                        props
                          .proposalDeposit(
                            id,
                            props.advanceUser === true
                              ? amount.toString()
                              : (amount * 1000000).toString()
                          )
                          .then((res) => {
                            setDepositLoading(false);
                            refreshProposal();
                            refreshDepositors();
                          });
                      }}
                      disabled={
                        !dayjs().isBefore(dayjs(proposal.deposit_end_time)) ||
                        proposal.status == "PROPOSAL_STATUS_VOTING_PERIOD" ||
                        validateAmountError !== null
                      }
                    >
                      Submit
                    </label>
                    <label
                      htmlFor="my-modal-2"
                      className="btn btn-sm"
                      onClick={(e) => {
                        setAmount("");
                      }}
                    >
                      Close
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex text-sm mt-8">
            <div className="mt-4 w-1/3 text-type-secondary">Proposer</div>
            <div className="mt-4 w-2/3 text-type-tertiary">{proposer}</div>
          </div>
          <div className="flex text-sm">
            <div className="mt-2 w-1/3 text-type-secondary">Type</div>
            <div className="mt-2 text-type-tertiary w-2/3">
              {typeof proposal.content !== "undefined"
                ? proposal.content["@type"] ==
                  "/cosmos.gov.v1beta1.TextProposal"
                  ? "TEXT"
                  : ""
                : ""}
              {typeof proposal.content !== "undefined"
                ? proposal.content["@type"] ==
                  "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal"
                  ? "SOFTWARE UPGRADE"
                  : ""
                : ""}
              {typeof proposal.content !== "undefined"
                ? proposal.content["@type"] ==
                  "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal"
                  ? "COMMUNITY POOL SPEND"
                  : ""
                : ""}
              {typeof proposal.content !== "undefined"
                ? proposal.content["@type"] ==
                  "/cosmos.params.v1beta1.ParameterChangeProposal"
                  ? "PARAMETER CHANGE"
                  : ""
                : ""}
            </div>
          </div>

          <div className="flex text-sm">
            <div className="mt-2 w-1/3 text-type-secondary">Total Deposit</div>
            <div className="mt-2 w-2/3 text-type-tertiary">
              {typeof proposal.total_deposit !== "undefined" &&
              proposal.total_deposit.length != 0
                ? (props.advanceUser === true
                    ? proposal.total_deposit[0].amount
                    : proposal.total_deposit[0].amount / 1000000) +
                  " " +
                  (props.advanceUser === true
                    ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                    : process.env.NEXT_PUBLIC_CURRENCY_TOKEN)
                : "0 " +
                  (props.advanceUser === true
                    ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                    : process.env.NEXT_PUBLIC_CURRENCY_TOKEN)}
            </div>
          </div>
          <div className="flex text-sm">
            <div className="mt-2 w-1/3 text-type-secondary">
              Initial Deposit
            </div>
            <div className="mt-2 w-2/3 text-type-tertiary">
              {typeof initialDeposit !== "undefined"
                ? (props.advanceUser === true
                    ? initialDeposit
                    : initialDeposit / 1000000) +
                  " " +
                  (props.advanceUser === true
                    ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                    : process.env.NEXT_PUBLIC_CURRENCY_TOKEN)
                : ""}
            </div>
          </div>
          <div className="flex text-sm">
            <div className="mt-2 w-1/3 text-type-secondary">Submit Time</div>
            <div className="mt-2 w-2/3 text-type-tertiary">
              {" " + dayjs(proposal.submit_time).format("LLL")}
            </div>
          </div>
          <div className="flex text-sm">
            <div className="mt-2 w-1/3 text-type-secondary">
              Deposit End Time
            </div>
            <div className="mt-2 w-2/3 text-type-tertiary">
              {" " + dayjs(proposal.deposit_end_time).format("LLL")}
            </div>
          </div>
          <div className="flex text-sm">
            <div className="mt-2 w-1/3 text-type-secondary">Voting Start</div>
            <div className="mt-2 w-2/3 text-type-tertiary">
              {dayjs(proposal.submit_time).unix() -
                dayjs(proposal.voting_start_time).unix() >
              0
                ? "--"
                : " " + dayjs(proposal.voting_start_time).format("LLL")}
            </div>
          </div>
          <div className="flex mb-16 text-sm">
            <div className="mt-2 w-1/3 text-type-secondary">Voting End</div>
            <div className="mt-2 w-2/3 text-type-tertiary">
              {dayjs(proposal.submit_time).unix() -
                dayjs(proposal.voting_end_time).unix() >
              0
                ? "--"
                : " " + dayjs(proposal.voting_end_time).format("LLL")}
            </div>
          </div>
          {/* Depositors Section */}

          <div className="overflow-x-auto mt-8">
            <table className="table w-full text-sm">
              <thead className="text-type-secondary">
                <tr>
                  <th className="w-2/3">Depositors</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody className="text-type-tertiary">
                <tr>
                  <td>{proposer}</td>
                  <td>
                    {props.advanceUser === true
                      ? initialDeposit
                      : initialDeposit / 1000000}{" "}
                    {props.advanceUser === true
                      ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
                      : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
                    <span
                      className={
                        "ml-2 border rounded-md pl-1.5 pr-2 py-px relative -top-px text-green-50 border-green"
                      }
                      style={{ fontSize: "0.75em" }}
                    >
                      initial deposit
                    </span>
                  </td>
                </tr>
                {depositors !== undefined
                  ? depositors.map((depositor, i) => {
                      return (
                        <tr key={"depositor" + i}>
                          <td>{depositor.body.messages[0].depositor}</td>
                          <td>
                            {props.advanceUser === true
                              ? depositor.body.messages[0].amount[0].amount
                              : depositor.body.messages[0].amount[0].amount /
                                1000000}{" "}
                            {props.advanceUser === true
                              ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
                              : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
                          </td>
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto mt-8">
            <table className="table w-full text-sm">
              <thead className="text-type-secondary">
                <tr>
                  <th className="w-2/3">Voters</th>
                  <th>Answer</th>
                </tr>
              </thead>
              <tbody className="text-type-tertiary">
                {voters !== undefined
                  ? voters.map((voter, i) => {
                      let option = voter.body.messages[0].option;
                      option = option.replace("VOTE_OPTION_", "");
                      option = option.replace(/\_/g, " ");
                      return (
                        <tr key={"voter" + i}>
                          <td>{voter.body.messages[0].voter}</td>
                          <td>{option}</td>
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return { advanceUser: state.user.advanceUser };
};

export default connect(mapStateToProps, { proposalDeposit, proposalVote })(
  DaoProposalDetails
);
