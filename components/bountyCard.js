import React from "react";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { coingeckoId } from "../ibc-assets-config";
import Link from "next/link";

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

const BountyCard = ({ bounty, tokenPrice }) => {
  const bountyData = bounty.bounty;
  const issueData = bounty.issue;
  const repository = bountyData.repository;
  const owner = repository.owner.owner;

  const dollarAmount = bountyData.amount[0].amount * tokenPrice;

  const isRewarded =
    bountyData.state === "BOUNTY_STATE_SRCDEBITTED" &&
    issueData.pullRequests.some((pr) => pr.pullRequest.state === "MERGED");
  console.log(bounty);
  return (
    <Link
      href={`/${bountyData.repository.owner.owner.username}/${bountyData.repository.name}/issues/${issueData.iid}`}
      legacyBehavior
    >
      <div className="flex flex-col justify-between relative cursor-pointer w-full border-2 border-grey rounded-lg p-4">
        {isRewarded ? (
          <div className="w-36 sm:w-0">
            <div className="absolute top-2 right-2 items-center rounded-full px-4 w-24 py-0.5 bg-[#AD731D] text-xs uppercase mt-0.5">
              Rewarded
            </div>
          </div>
        ) : bountyData.state === "BOUNTY_STATE_SRCDEBITTED" ? (
          <div className="w-36 sm:w-0">
            <div className="absolute top-2 right-2 items-center rounded-full px-8 w-24 py-0.5 bg-purple text-xs uppercase mt-0.5">
              Open
            </div>
          </div>
        ) : (
          <div className="w-36 sm:w-0">
            <div
              className="flex items-center rounded-full px-5 w-24 py-0.5 bg-grey text-xs uppercase mt-0.5"
              data-test="bounty_reverted"
            >
              Reverted
            </div>
          </div>
        )}
        <div className="mb-4">
          {bountyData.amount.map((c, index) => (
            <div key={index} className="mb-2">
              <div className="text-type-secondary">
                <div className="flex text-sm items-center">
                  <div className="mr-1.5">
                    <img
                      src={coingeckoId[c.denom]?.icon || ""}
                      width={24}
                      height={24}
                      alt={c.denom}
                    />
                  </div>
                  <div className="uppercase ml-1 mr-3 text-xs">
                    {coingeckoId[c.denom]?.coinDenom || c.denom}
                  </div>
                  <svg
                    width="1"
                    height="15"
                    viewBox="0 0 1 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="1" height="12" fill="#404450" />
                  </svg>
                  <div className="ml-3 text-sm">
                    {parseFloat(c.amount)} LORE
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="ml-2 font-bold text-sm">
            ${dollarAmount.toFixed(2)} USD
          </div>
        </div>

        <div className="flex-1">
          <h6 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">
            {issueData.title}
          </h6>
          <div
            className="text-xs font-normal text-gray-700 dark:text-gray-400"
            style={{ wordBreak: "break-word" }}
          >
            <ReactMarkdown>
              {truncateText(issueData.description, 150)}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-2 text-xs text-type-tertiary flex justify-between items-center text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <img
              src={owner.avatarUrl}
              alt={owner.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                {owner.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {repository.name}
              </div>
            </div>
          </div>
          <span>{dayjs.unix(bountyData.updatedAt).fromNow()}</span>
        </div>
      </div>
    </Link>
  );
};

export default BountyCard;
