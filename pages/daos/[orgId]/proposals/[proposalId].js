import Head from "next/head";
import Header from "../../../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import getProposal from "../../../../helpers/getProposal";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { proposalDeposit } from "../../../../store/actions/proposals";
import { proposalVote } from "../../../../store/actions/proposals";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import getTally from "../../../../helpers/getTally";
import Link from "next/dist/client/link";
import getDepositor from "../../../../helpers/getDepositor";
import getVoter from "../../../../helpers/getVoter";

function ProposalDetailsView(props) {
  const [amount, setAmount] = useState("");
  const [validateAmountError, setValidateAmountError] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [voteAbstainLoading, setVoteAbstainLoading] = useState(false);
  const [voteNoLoading, setVoteNoLoading] = useState(false);
  const [voteYesLoading, setVoteYesLoading] = useState(false);
  const [voteNoWithVetoLoading, setVoteNoWithVetoLoading] = useState(false);
  const [proposal, setProposal] = useState([""]);
  const [proposer, setProposer] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [tally, setTally] = useState({});
  const [depositors, setDepositors] = useState([]);
  const [voters, setVoters] = useState([]);
  const router = useRouter();
  const id = router.query.proposalId;
  const hrefBase = "/daos/" + router.query.orgId;
  const type = "@type";
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  useEffect(async () => {
    if (id !== undefined) {
      await getProposal(id).then((res) => {
        if (res !== undefined) {
          setProposal(res.msg);
          setProposer(res.proposer);
          setInitialDeposit(res.initial_deposit);
        } else {
          router.push("/daos/" + router.query.userId + "/proposals");
        }
      });
    }
  }, [id, proposal]);

  useEffect(async () => {
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
  }, [id, proposal]);

  useEffect(async () => {
    if (id !== undefined) {
      await getDepositor(id).then((res) => {
        if (res !== undefined) {
          setDepositors(res.slice(1, res.length));
        }
      });
    }
  }, [id, proposal]);

  useEffect(async () => {
    if (id !== undefined) {
      await getVoter(id).then((res) => {
        setVoters(res);
      });
    }
  }, [id, proposal]);

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
  const letter = proposer ? proposer.slice(-1) : "x";

  const avatarLink =
    "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
    letter;

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
          <div className="flex  ">
            <div className="">
              <Link href={hrefBase + "/proposals"}>
                <label className="flex link text-sm uppercase no-underline items-center hover:text-green mt-20">
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
            {proposal !== undefined ? (
              <div className="mt-4 px-28 mt-32">
                <div className="flex">
                  <div className="text-2xl uppercase font-bold">{"#" + id}</div>
                  {proposal.status == "PROPOSAL_STATUS_PASSED" ? (
                    <div className="badge badge-success ml-auto h-10 w-32 bg-green-900 text-white">
                      PASSED
                    </div>
                  ) : (
                    ""
                  )}
                  {proposal.status == "PROPOSAL_STATUS_REJECTED" ? (
                    <div className="badge badge-error ml-auto h-10 w-32 bg-pink text-white">
                      REJECTED
                    </div>
                  ) : (
                    ""
                  )}
                  {proposal.status == "PROPOSAL_STATUS_DEPOSIT_PERIOD" ? (
                    <div className="badge badge-info ml-auto h-10 w-32 bg-tertiary text-white">
                      DEPOSIT PERIOD
                    </div>
                  ) : (
                    ""
                  )}
                  {proposal.status == "PROPOSAL_STATUS_VOTING_PERIOD" ? (
                    <div className="badge badge-info ml-auto h-10 w-32 bg-tertiary text-white">
                      VOTING PERIOD
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mt-5 text-2xl font-semibold">
                  {typeof proposal.content !== "undefined"
                    ? proposal.content.title
                    : ""}
                </div>
                <div className="mt-3 text-type-secondary mb-14">
                  {typeof proposal.content !== "undefined" ? (
                    <div className="mb-3">{proposal.content.description} </div>
                  ) : (
                    ""
                  )}

                  {typeof proposal.content !== "undefined" ? (
                    proposal.content["@type"] ==
                    "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal" ? (
                      <div>
                        <div>{"Plan Name: " + proposal.content.plan.name}</div>
                        <div>
                          {"Upgrade Height: " + proposal.content.plan.height}
                        </div>
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
                        <div>
                          {"Recipient: " + proposal.content["recipient"]}
                        </div>
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
                            <div>
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

                <div className="card w-full bg-base-300 shadow-xl rounded-lg h-48 mr-20">
                  <div className="flex flex-row card-body">
                    <div className="mt-12">Cast Your Vote</div>
                    <div className="flex flex-col">
                      <div style={{ width: 90, height: 90 }} className="ml-20">
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
                          "btn btn-outline btn-xs h-8 w-24 text-xs mt-5 ml-20 " +
                          (voteYesLoading ? "loading" : "")
                        }
                        onClick={(e) => {
                          setVoteYesLoading(true);
                          props
                            .proposalVote(id, "VOTE_OPTION_YES")
                            .then((res) => {
                              setVoteYesLoading(false);
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
                    <div className="flex flex-col">
                      <div style={{ width: 90, height: 90 }} className="ml-20">
                        <CircularProgressbar
                          value={getPercentage("no")}
                          text={`${getPercentage("no")}%`}
                          styles={buildStyles({
                            textColor: "#E2EBF2",
                            pathColor: "#883BE6",
                            trailColor: "#3E4051",
                          })}
                        />
                      </div>
                      <button
                        className={
                          "btn btn-outline btn-xs h-8 w-24 text-xs mt-5 ml-20 " +
                          (voteNoLoading ? "loading" : "")
                        }
                        onClick={(e) => {
                          setVoteNoLoading(true);
                          props
                            .proposalVote(id, "VOTE_OPTION_NO")
                            .then((res) => {
                              setVoteNoLoading(false);
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
                    <div className="flex flex-col">
                      <div style={{ width: 90, height: 90 }} className="ml-20">
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
                          "btn btn-outline btn-xs h-8 w-24 text-xs mt-5 ml-20 " +
                          (voteAbstainLoading ? "loading" : "")
                        }
                        onClick={(e) => {
                          setVoteAbstainLoading(true);
                          props
                            .proposalVote(id, "VOTE_OPTION_ABSTAIN")
                            .then((res) => {
                              setVoteAbstainLoading(false);
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
                    <div className="flex flex-col">
                      <div style={{ width: 90, height: 90 }} className="ml-20">
                        <CircularProgressbar
                          value={getPercentage("no_with_veto")}
                          text={`${getPercentage("no_with_veto")}%`}
                          styles={buildStyles({
                            textColor: "#E2EBF2",
                            pathColor: "#FCC945",
                            trailColor: "#3E4051",
                          })}
                        />
                      </div>
                      <button
                        className={
                          "btn btn-outline btn-xs h-8 w-32 text-xs mt-5 ml-16 " +
                          (voteNoWithVetoLoading ? "loading" : "")
                        }
                        onClick={(e) => {
                          setVoteNoWithVetoLoading(true);
                          props
                            .proposalVote(id, "VOTE_OPTION_NO_WITH_VETO")
                            .then((res) => {
                              setVoteNoWithVetoLoading(false);
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
                <div className="flex mt-4">
                  <label
                    htmlFor="my-modal-2"
                    className={
                      "btn btn-primary btn-xs modal-button text-xs h-8 w-36 uppercase ml-auto " +
                      (depositLoading ? "loading" : "")
                    }
                    disabled={
                      !dayjs().isBefore(dayjs(proposal.deposit_end_time)) ||
                      proposal.status == "PROPOSAL_STATUS_VOTING_PERIOD"
                    }
                  >
                    SUBMIT DEPOSIT
                  </label>
                </div>
                <input
                  type="checkbox"
                  id="my-modal-2"
                  className="modal-toggle"
                />
                <div class="modal">
                  <div class="modal-box">
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
                                });
                            }}
                            disabled={
                              !dayjs().isBefore(
                                dayjs(proposal.deposit_end_time)
                              ) ||
                              proposal.status ==
                                "PROPOSAL_STATUS_VOTING_PERIOD" ||
                              validateAmountError !== null
                            }
                          >
                            SUBMIT
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

                <div className="text-xl">Details</div>
                <div className="flex">
                  <div className="mt-4 secondary font-bold w-1/2">
                    {"Proposer "}
                  </div>
                  <div className="mt-4 secondary text font-normal text-type-secondary">
                    {proposer}
                  </div>
                </div>
                <div className="flex">
                  <div className="mt-2 secondary font-bold w-1/2">
                    {"Type "}
                  </div>
                  <div className="mt-2 secondary text font-normal text-type-secondary w-1/2">
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

                <div className="flex">
                  <div className="mt-2 secondary font-bold w-1/2">
                    {"Total Deposit "}
                  </div>
                  <div className="mt-2 secondary text font-normal text-type-secondary w-1/2">
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
                <div className="flex">
                  <div className="mt-2 secondary font-bold w-1/2">
                    {"Initial Deposit "}
                  </div>
                  <div className="mt-2 secondary text font-normal text-type-secondary w-1/2">
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
                <div className="flex">
                  <div className="mt-2 secondary font-bold w-1/2">
                    {"Submit Time "}
                  </div>
                  <div className="mt-2 secondary text font-normal text-type-secondary w-1/2">
                    {" " + dayjs(proposal.submit_time).format("LLL")}
                  </div>
                </div>
                <div className="flex">
                  <div className="mt-2 secondary font-bold w-1/2">
                    {"Deposit End Time "}
                  </div>
                  <div className="mt-2 secondary text font-normal text-type-secondary w-1/2">
                    {" " + dayjs(proposal.deposit_end_time).format("LLL")}
                  </div>
                </div>
                <div className="flex">
                  <div className="mt-2 secondary font-bold w-1/2">
                    {"Voting Start "}
                  </div>
                  <div className="mt-2 secondary text font-normal text-type-secondary w-1/2">
                    {dayjs(proposal.submit_time).unix() -
                      dayjs(proposal.voting_start_time).unix() >
                    0
                      ? "--"
                      : " " + dayjs(proposal.voting_start_time).format("LLL")}
                  </div>
                </div>
                <div className="flex mb-16">
                  <div className="mt-2 secondary font-bold w-1/2">
                    {"Voting End "}
                  </div>
                  <div className="mt-2 secondary text font-normal text-type-secondary w-1/2">
                    {dayjs(proposal.submit_time).unix() -
                      dayjs(proposal.voting_end_time).unix() >
                    0
                      ? "--"
                      : " " + dayjs(proposal.voting_end_time).format("LLL")}
                  </div>
                </div>
                {/* Depositors Section */}

                <div className="text-xl">Depositors</div>
                <div className="overflow-x-auto mb-10 mt-5">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Depositor</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
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
                        ? depositors.map((depositor) => {
                            return (
                              <tr>
                                <td>{depositor.body.messages[0].depositor}</td>
                                <td>
                                  {props.advanceUser === true
                                    ? depositor.body.messages[0].amount[0]
                                        .amount
                                    : depositor.body.messages[0].amount[0]
                                        .amount / 1000000}{" "}
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

                <div className="text-xl">Voters</div>
                <div className="overflow-x-auto mb-10 mt-5">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Voter</th>
                        <th>Answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voters !== undefined
                        ? voters.map((voter) => {
                            return (
                              <tr>
                                <td>{voter.body.messages[0].voter}</td>
                                <td>{voter.body.messages[0].option}</td>
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
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { advanceUser: state.user.advanceUser };
};

export default connect(mapStateToProps, { proposalDeposit, proposalVote })(
  ProposalDetailsView
);
