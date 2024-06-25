import React from 'react';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import { coingeckoId } from '../ibc-assets-config';

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

const BountyCard = ({ bounty, tokenPrice }) => {
  const bountyData = bounty.bounty;
  const issueData = bounty.issue;
  const repository = bountyData.repository;
  const owner = repository.owner.owner;

  const dollarAmount = bountyData.amount[0].amount * tokenPrice;

  const isRewarded = bountyData.state === 'BOUNTY_STATE_SRCDEBITTED' &&
                     issueData.pullRequests.some(pr => pr.pullRequest.state === 'MERGED');

  const stateLabel = isRewarded ? 'REWARDED' : (
    bountyData.state === 'BOUNTY_STATE_SRCDEBITTED' ? 'OPEN' : 'CLOSED'
  );

  const stateColor = stateLabel === 'REWARDED' ? 'bg-yellow-500' :
                     stateLabel === 'OPEN' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-4 flex flex-col justify-between relative">
      <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${stateColor} text-white`}>
        {stateLabel}
      </div>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <img src={owner.avatarUrl} alt={owner.username} className="w-8 h-8 rounded-full mr-2" />
          <div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">{owner.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{repository.name}</div>
          </div>
        </div>

        {bountyData.amount.map((c, index) => (
          <div key={index} className="mb-2">
            <div className="text-type-secondary">
              <div className="flex text-sm items-center">
                <div className="mr-1.5">
                  <img
                    src={coingeckoId[c.denom]?.icon || ''}
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
                <div className="ml-3 text-xs">{parseFloat(c.amount)} LORE</div>
              </div>
            </div>
          </div>
        ))}
        <div className="ml-2 font-bold text-xs text-type-tertiary">
          ≈${dollarAmount.toFixed(2)} USD
        </div>
      </div>

      <div className="flex-1">
        <h6 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {issueData.title}
        </h6>
        <div className="font-normal text-gray-700 dark:text-gray-400" style={{ wordBreak: 'break-word' }}>
          <ReactMarkdown>
            {truncateText(issueData.description, 150)}
          </ReactMarkdown>
        </div>

      </div>

      <div className="mt-2 flex justify-between items-center text-gray-600 dark:text-gray-400">
        <span>{dayjs.unix(bountyData.updatedAt).fromNow()}</span>
        <a
          href={`/${bountyData.repository.owner.owner.username}/${bountyData.repository.name}/issues/${issueData.iid}`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default BountyCard;
