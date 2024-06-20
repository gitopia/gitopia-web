import dayjs from "dayjs";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const showProposalStatus = (proposal) => {
  const baseClass = "w-4 h-4 mr-2";
  switch (proposal.status) {
    case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
      return (
        <div className="flex text-purple text-xs items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={baseClass}
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
          <span className="ml-2 text-xs text-type-tertiary">
            {"Cutoff " + dayjs(proposal.deposit_end_time).fromNow()}
          </span>
        </div>
      );
    case "PROPOSAL_STATUS_REJECTED":
      return (
        <div className="flex text-pink text-xs items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={baseClass}
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
          <span className="ml-2 text-xs text-type-tertiary">
            {"Voting ended " + dayjs(proposal.voting_end_time).fromNow()}
          </span>
        </div>
      );
    case "PROPOSAL_STATUS_PASSED":
      return (
        <div className="flex text-green text-xs items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={baseClass}
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
          <span className="ml-2 text-xs text-type-tertiary">
            {"Voting ended " + dayjs(proposal.voting_end_time).fromNow()}
          </span>
        </div>
      );
    case "PROPOSAL_STATUS_VOTING_PERIOD":
      return (
        <div className="flex text-teal text-xs items-center">
          <div className="flex relative top-px w-4 h-4 mr-2 items-center justify-center">
            <div
              className={
                "absolute w-3 h-3 rounded-full bg-teal opacity-75 animate-ping"
              }
            ></div>
            <div className="absolute w-2 h-2 rounded-full bg-teal"></div>
          </div>
          <span>LIVE</span>
          <span className="ml-2 text-xs text-type-tertiary">
            {"Voting ends " + dayjs(proposal.voting_end_time).fromNow()}
          </span>
        </div>
      );
  }
};

export default function ProposalItem({
  proposal = { content: { description: "" }, final_tally_result: {} },
  hrefBase = "",
}) {
  return (
    <Link href={hrefBase + "&id=" + proposal.proposal_id} legacyBehavior>
      <div className="cursor-pointer w-full border-2 border-grey rounded-lg p-4">
        <div className="text-sm">
          <span>{proposal.content.title}</span>
          <span className="ml-2 text-neutral">
            {"#" + proposal.proposal_id}
          </span>
        </div>
        <div className="mt-2 text-xs text-type-secondary markdown-body">
          <ReactMarkdown linkTarget="_blank">
            {proposal.content.description
              ? proposal.content.description.slice(0, 250)
              : JSON.stringify(proposal.content)}
          </ReactMarkdown>
        </div>
        <div className="mt-4 flex justify-start items-center">
          {showProposalStatus(proposal)}
        </div>
      </div>
    </Link>
  );
}
