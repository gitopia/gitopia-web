import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/landingPageFooter";
import BountyCard from "../../components/bountyCard";
import client from "../../helpers/apolloClient";
import { useApiClient } from "../../context/ApiClientContext";
import getDenomNameByHash from "../../helpers/getDenomNameByHash";
import { notify } from "reapop";

const QUERY_BOUNTY = gql`
  query Bounties($skip: Int = 0, $bountyState: String, $issueState: String) {
    _meta {
      block {
        number
      }
    }
    issueBounties(
      first: 14
      skip: $skip
      orderDirection: desc
      orderBy: issue__updatedAt
      where: {
        bounty_: { repository_in: ["R5", "R6", "R7"], state: $bountyState }
        issue_: { state: $issueState }
      }
    ) {
      id
      issue {
        iid
        state
        title

        repository {
          id
          repository {
            id
            name
            owner {
              owner {
                address
                avatarUrl
                name
                username
              }
            }
          }
        }
        description
        pullRequests {
          pullRequest {
            state
          }
        }
        bounties {
          id
          bounty {
            id
            state
            amount {
              amount
              denom
            }
            updatedAt
            expireAt
            repository {
              id
              name
              allowForking
              forksCount
              ownerId
              owner {
                owner {
                  address
                  avatarUrl
                  description
                  name
                  username
                }
              }
            }
          }
        }
      }
    }
  }
`;

const getStatuses = (tab, offset) => {
  let bountyState, issueState;
  switch (tab) {
    case "open":
      bountyState = "BOUNTY_STATE_SRCDEBITTED";
      issueState = "OPEN";
      break;
    case "closed":
      bountyState = "BOUNTY_STATE_REVERTEDBACK";
      issueState = "CLOSED";
      break;
    case "rewarded":
      bountyState = "BOUNTY_STATE_DESTCREDITED";
      issueState = "CLOSED";
      break;
    default:
      bountyState = "BOUNTY_STATE_SRCDEBITTED";
      issueState = "OPEN";
  }
  return { bountyState, issueState, skip: offset };
};

function Bounties(props) {
  const [bounties, setBounties] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentTab, setCurrentTab] = useState("open");
  const [tokenPrice, setTokenPrice] = useState(0);
  const { apiClient } = useApiClient();

  const { data, error, loading, fetchMore } = useQuery(QUERY_BOUNTY, {
    client: client,
    variables: getStatuses(currentTab, offset),
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (!bounties.length) {
        processBounties(data.issueBounties);
      }
    },
  });

  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=gitopia&vs_currencies=usd"
        );
        const data = await response.json();
        setTokenPrice(data.gitopia.usd);
      } catch (err) {
        console.error(err);
        props.notify("Error fetching token prices", "error");
      }
    };

    fetchTokenPrice();
  }, []);

  const processedIssueIds = new Set();

  const processBounties = async (issueBounties) => {
    const groupedBounties = {};

    for (const issueBounty of issueBounties) {
      const issue = issueBounty.issue;
      const issueId = issue.repository.repository.id + "-" + issue.iid;

      if (processedIssueIds.has(issueId)) {
        console.log(`Skipping duplicate issue with ID ${issueId}`);
        continue; // Skip this issue because it has already been processed
      }

      processedIssueIds.add(issueId); // Mark this issue as processed

      if (!groupedBounties[issueId]) {
        groupedBounties[issueId] = {
          ...issue,
          cumulativeAmount: [],
        };
      }

      for (const bounty of issue.bounties) {
        for (const amount of bounty.bounty.amount) {
          const denomName = amount.denom.includes("ibc")
            ? await getDenomNameByHash(apiClient, amount.denom)
            : amount.denom;

          const parsedAmount = parseFloat(amount.amount) / Math.pow(10, 6);

          let existingAmount = groupedBounties[issueId].cumulativeAmount.find(
            (a) => a.denomName === denomName
          );

          if (existingAmount) {
            existingAmount.amount += parsedAmount;
            console.log(
              `Adding ${parsedAmount} to existing ${denomName} for issue ${issueId}. Total: ${existingAmount.amount}`
            );
          } else {
            groupedBounties[issueId].cumulativeAmount.push({
              amount: parsedAmount,
              denomName: denomName,
            });
            console.log(
              `Creating new entry for ${denomName} with amount ${parsedAmount} for issue ${issueId}`
            );
          }
        }
      }
    }

    console.log("Final grouped bounties:", groupedBounties);
    setBounties((prevBounties) => [
      ...prevBounties,
      ...Object.values(groupedBounties),
    ]);
    setOffset((prevOffset) => prevOffset + issueBounties.length);
    setHasMore(issueBounties.length === 14);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMore({
        variables: { skip: offset },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            issueBounties: [
              ...prev.issueBounties,
              ...fetchMoreResult.issueBounties,
            ],
          };
        },
      }).then(({ data }) => {
        if (data && data.issueBounties) {
          processBounties(data.issueBounties);
        }
      });
    }
  };

  if (error) return <p>Error loading bounties</p>;

  return (
    <>
      <Head>
        <title>Gitopia - Bounties</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className="relative mt-12 flex flex-col items-center lg:mt-16">
        <div className="w-full max-w-screen-lg items-center">
          <div className="p-4 pt-8 lg:p-0">
            <div className="text-4xl font-bold tracking-tight lg:text-center lg:text-5xl">
              Bounties
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bounties.map((issue) => (
              <BountyCard
                key={issue.repository.repository.id + "-" + issue.iid}
                bounty={issue.bounties[0].bounty}
                issue={issue}
                tokenPrice={tokenPrice}
              />
            ))}
          </div>
          <div className="flex justify-center">
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
              <button
                onClick={loadMore}
                className="mt-4 btn btn-primary btn-sm"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default connect(null, { notify })(Bounties);
