import Head from "next/head";
import Header from "../../../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import getProposal from "../../../../helpers/getProposal";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { proposalDeposit } from "../../../../store/actions/proposals";
import { proposalVote } from "../../../../store/actions/proposals";

function RepositoryProposalDetailsView(props) {
  const [proposal, setProposal] = useState([""]);
  const router = useRouter();
  const id = router.query.proposalId;
  const type = "@type";
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  useEffect(async () => {
    const p = await getProposal(id);
    //console.log(p);
    setProposal(p);
  });

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
          <div className="flex-1 p-4 pt-24 px-36">
            <h1 className="mb-4 text-2xl"> Proposal Details</h1>
          </div>
          <div className="flex mt-4 px-36">
            {proposal !== undefined ? (
              <div>
                <div className="flex flex-col items-center">
                  <div className="h-full w-full border-2 border-grey rounded-lg p-3">
                    <div className="flex">
                      <div className="mt-2 ml-4 text-sm uppercase font-bold">
                        {"#" + id}
                      </div>
                      <div className="mt-2 ml-auto font-bold text-xs secondary uppercase mr-3">
                        {dayjs(proposal.submit_time).fromNow()}
                      </div>
                    </div>
                    <div className="mt-1  ml-4 text-sm uppercase font-medium text-type">
                      {typeof proposal.content !== "undefined"
                        ? proposal.content.title
                        : ""}
                    </div>
                    <div className="mt-4 w-fit border-t-2 border-grey ml-3 mr-3 mb-4"></div>
                    <div className="flex mr-5 mt-5 secondary font-bold text-xs ml-4">
                      {"Proposer "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-96">
                        {
                          //" " + proposal.voting_end_time
                        }
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                      {"Status "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-96">
                        {proposal.status}
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                      {"Total Deposit "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-96 pr-20">
                        {typeof proposal.total_deposit !== "undefined"
                          ? proposal.total_deposit[0].amount + " tlore"
                          : ""}
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                      {"Voting Start "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-80 pr-6">
                        {" " + dayjs(proposal.voting_start_time).format("LLL")}
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                      {"Voting End "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-80 pr-6">
                        {" " + dayjs(proposal.voting_end_time).format("LLL")}
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                      {"Type "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-80">
                        {typeof proposal.content !== "undefined"
                          ? proposal.content["@type"]
                          : ""}
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                      {"Submit Time "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-80 pr-6">
                        {" " + dayjs(proposal.submit_time).format("LLL")}
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                      {"Deposit End Time "}
                      <div className="ml-auto secondary text-xs font-normal text-type-secondary mr-80 pr-6">
                        {" " + dayjs(proposal.deposit_end_time).format("LLL")}
                      </div>
                    </div>
                    <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4 mb-2">
                      {"Details "}
                      <div className="ml-32 secondary text-xs font-normal text-type-secondary">
                        {typeof proposal.content !== "undefined"
                          ? proposal.content.description
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={"btn btn-sm btn-primary btn-block h-8 text-xs "}
                  onClick={(e) => {
                    props.proposalDeposit(id, 10).then((res) => {});
                  }}
                  disabled={
                    dayjs().unix() - dayjs(proposal.deposit_end_time).unix() >
                      0 ===
                    true
                  }
                >
                  Submit Deposit
                </button>
                <div className="mt-18">
                  <button
                    className={"btn btn-sm btn-primary btn-block h-8 text-xs"}
                    onClick={(e) => {
                      props
                        .proposalVote(id, "VOTE_OPTION_NO_WITH_VETO")
                        .then((res) => {});
                    }}
                    disabled={
                      (dayjs().unix() -
                        dayjs(proposal.voting_start_time).unix() <
                        0 &&
                        dayjs().unix() -
                          dayjs(proposal.voting_start_time).unix() >
                          0) === true
                    }
                  >
                    Submit Vote
                  </button>
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
  return {};
};

export default connect(mapStateToProps, { proposalDeposit, proposalVote })(
  RepositoryProposalDetailsView
);
