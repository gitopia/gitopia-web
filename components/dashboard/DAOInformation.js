import React, { useState, useEffect } from "react";
import {
  Globe,
  MapPin,
  Clock,
  Info,
  Percent,
  Users,
  Link as LinkIcon,
  Wallet,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  GitPullRequest,
  Trash2,
  UsersRound,
  Tag,
  Settings2,
} from "lucide-react";
import { useApiClient } from "../../context/ApiClientContext";
import axios from "axios";

const TokenBalance = ({
  token,
  balance,
  dollarValue,
  isLoading,
  change24h,
}) => (
  <div className="flex items-center py-3 first:pt-0 last:pb-0 border-b last:border-0 border-base-200">
    <div className="flex items-center flex-1">
      <div className="w-8 h-8 rounded-full bg-base-200 p-1 mr-3 flex items-center justify-center">
        {token.logo ? (
          <img src={token.logo} alt={token.symbol} className="w-full h-full" />
        ) : (
          <span className="text-xs font-bold">{token.symbol.slice(0, 3)}</span>
        )}
      </div>
      <div>
        <div className="font-semibold">{token.name}</div>
        <div className="text-sm text-gray-400">{token.symbol}</div>
      </div>
    </div>
    {isLoading ? (
      <div className="loading loading-spinner loading-sm"></div>
    ) : (
      <div className="text-right">
        <div className="font-bold">
          {balance.toLocaleString()} {token.symbol}
        </div>
        <div className="text-sm flex items-center justify-end gap-1">
          <span className="text-gray-400">${dollarValue.toLocaleString()}</span>
          {change24h && (
            <span
              className={`flex items-center ${
                change24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change24h >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(change24h)}%
            </span>
          )}
        </div>
      </div>
    )}
  </div>
);

const TreasuryCard = ({ balances, isLoading }) => {
  const totalValue = balances.reduce(
    (sum, token) => sum + (token.dollarValue || 0),
    0
  );

  return (
    <div className="col-span-2 bg-base-300 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-gray-400">Treasury Balance</h4>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </div>
          </div>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() =>
            window.open("https://www.mintscan.io/gitopia", "_blank")
          }
        >
          View on Explorer
          <ExternalLink className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="bg-base-200 rounded-lg p-4">
        <div className="divide-y divide-base-300">
          {balances.map((token, index) => (
            <TokenBalance
              key={token.symbol}
              token={token}
              balance={token.balance}
              dollarValue={token.dollarValue}
              isLoading={isLoading}
              change24h={token.change24h}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, value, isLink }) => (
  <div className="bg-base-300 rounded-lg p-4 flex items-start space-x-3">
    <div className="p-2 bg-base-200 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-400 mb-1">{title}</h4>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-focus flex items-center space-x-1"
        >
          <span className="break-all">{value}</span>
          <LinkIcon className="w-4 h-4" />
        </a>
      ) : (
        <p className="text-base-content">{value || "Not specified"}</p>
      )}
    </div>
  </div>
);

const DaoConfigCard = ({ config }) => {
  const configItems = [
    {
      icon: GitPullRequest,
      title: "Pull Request Proposals",
      value: config?.requirePullRequestProposal,
      description: "DAO approval required for merging pull requests",
    },
    {
      icon: Trash2,
      title: "Repository Deletion Proposals",
      value: config?.requireRepositoryDeletionProposal,
      description: "DAO approval required for deleting repositories",
    },
    {
      icon: UsersRound,
      title: "Collaborator Management Proposals",
      value: config?.requireCollaboratorProposal,
      description: "DAO approval required for managing collaborators",
    },
    {
      icon: Tag,
      title: "Release Management Proposals",
      value: config?.requireReleaseProposal,
      description: "DAO approval required for managing releases",
    },
  ];

  return (
    <div className="col-span-2 bg-base-300 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
            <Settings2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-gray-400">DAO Configuration</h4>
            <div className="text-sm text-gray-500">Governance requirements</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configItems.map((item, index) => (
          <div key={index} className="bg-base-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-base-300 rounded-lg">
                <item.icon
                  className={`w-5 h-5 ${
                    item.value ? "text-primary" : "text-gray-500"
                  }`}
                />
              </div>
              <div>
                <h5 className="font-medium mb-1">{item.title}</h5>
                <p className="text-sm text-gray-400">{item.description}</p>
                <div
                  className={`mt-2 text-sm ${
                    item.value ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {item.value ? "Required" : "Not Required"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DAOInformation({ dao, policyInfo }) {
  const [treasuryBalances, setTreasuryBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cosmosBankApiClient } = useApiClient();

  const getQuorumPercentage = () => {
    if (
      policyInfo &&
      policyInfo.info.decision_policy["@type"] ===
        "/cosmos.group.v1.PercentageDecisionPolicy"
    ) {
      return parseFloat(policyInfo.info.decision_policy.percentage) * 100;
    }
    return null;
  };

  const getVotingPeriod = () => {
    if (policyInfo) {
      const hours =
        parseInt(policyInfo.info.decision_policy.windows.voting_period) / 3600;
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    return null;
  };

  useEffect(() => {
    const fetchTreasuryBalances = async () => {
      if (!dao.address) return;

      try {
        setIsLoading(true);

        // Fetch balances from the chain
        const balanceResponse = await cosmosBankApiClient.queryAllBalances(
          dao.address
        );

        // Fetch prices from CoinGecko (example with multiple tokens)
        const priceResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=gitopia&vs_currencies=usd&include_24hr_change=true"
        );

        // Process each balance
        const processedBalances = await Promise.all(
          balanceResponse.data.balances.map(async (balance) => {
            let tokenInfo = {
              symbol: "",
              name: "",
              logo: "",
              balance: 0,
              dollarValue: 0,
              change24h: null,
            };

            // Example token mapping - expand this based on your needs
            switch (balance.denom) {
              case "ulore":
                tokenInfo = {
                  symbol: "LORE",
                  name: "Gitopia",
                  logo: "/tokens/gitopia.svg",
                  balance: parseFloat(
                    (parseInt(balance.amount) / 1000000).toFixed(6)
                  ),
                  dollarValue: parseFloat(
                    (
                      (parseInt(balance.amount) / 1000000) *
                      priceResponse.data.gitopia.usd
                    ).toFixed(2)
                  ),
                  change24h: parseFloat(
                    priceResponse.data.gitopia.usd_24h_change?.toFixed(2)
                  ),
                };
                break;
              // Add more token cases here
              default:
                tokenInfo = {
                  symbol: balance.denom,
                  name: balance.denom.toUpperCase(),
                  balance: parseFloat(
                    (parseInt(balance.amount) / 1000000).toFixed(6)
                  ),
                  dollarValue: 0,
                };
            }

            return tokenInfo;
          })
        );

        setTreasuryBalances(
          processedBalances.sort((a, b) => b.dollarValue - a.dollarValue)
        );
      } catch (error) {
        console.error("Error fetching treasury balances:", error);
        setTreasuryBalances([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreasuryBalances();
  }, [dao.address]);

  return (
    <div className="bg-base-200 p-6 rounded-xl">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">DAO Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={Info} title="Description" value={dao.description} />

        <InfoCard icon={MapPin} title="Location" value={dao.location} />

        <InfoCard
          icon={Globe}
          title="Website"
          value={dao.website}
          isLink={true}
        />

        <InfoCard
          icon={Clock}
          title="Voting Period"
          value={getVotingPeriod()}
        />

        <InfoCard
          icon={Percent}
          title="Quorum Required"
          value={
            getQuorumPercentage()
              ? `${getQuorumPercentage().toFixed(2)}%`
              : null
          }
        />

        <TreasuryCard balances={treasuryBalances} isLoading={isLoading} />

        <DaoConfigCard config={dao.config} />
      </div>
    </div>
  );
}
