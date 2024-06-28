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
      first: 13
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
        description
        pullRequests {
          pullRequest {
            state
          }
        }
      }
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
  const { ibcAppTransferApiClient } = useApiClient();

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

  const processBounties = async (bounties) => {
    // Group bounties by repository ID and issue IID
    const groupedBounties = bounties.reduce((acc, bounty) => {
      const repositoryId = bounty.bounty.repository.id;
      const issueIid = bounty.issue.iid;
      const key = `${repositoryId}-${issueIid}`;

      if (!acc[key]) {
        acc[key] = { ...bounty, bounty: { ...bounty.bounty, amount: [] } };
      }
      acc[key].bounty.amount.push(...bounty.bounty.amount);
      return acc;
    }, {});

    // Process each grouped bounty
    const processedBounties = await Promise.all(
      Object.values(groupedBounties).map(async (bounty) => {
        const processedAmount = await Promise.all(
          bounty.bounty.amount.map(async (c) => {
            const denomName = c.denom.includes("ibc")
              ? await getDenomNameByHash(ibcAppTransferApiClient, c.denom)
              : c.denom;

            return {
              ...c,
              amount: parseFloat(c.amount) / Math.pow(10, 6),
              denomName: denomName,
            };
          })
        );

        // Combine amounts by denom
        const combinedAmount = processedAmount.reduce((acc, amount) => {
          if (!acc[amount.denomName]) {
            acc[amount.denomName] = { ...amount, amount: 0 };
          }
          acc[amount.denomName].amount += amount.amount;
          return acc;
        }, {});

        return {
          ...bounty,
          bounty: {
            ...bounty.bounty,
            amount: Object.values(combinedAmount),
          },
        };
      })
    );

    setBounties((prevBounties) => [...prevBounties, ...processedBounties]);
    setOffset((prevOffset) => prevOffset + bounties.length);
    setHasMore(bounties.length === 13);
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
          {/* <div className="border-grey-50 bg-base-200/70 relative mx-4 mt-12 max-w-2xl rounded-xl border text-sm lg:mx-auto lg:mt-16">
            <div className="bg-base-200 border-grey-50 absolute -top-3 left-1/2 -ml-12 rounded-full border px-4 py-1 text-xs font-bold uppercase text-purple-50">
              Stats
            </div>
            <div className="flex flex-col justify-evenly gap-8 p-8 pt-10 lg:flex-row">
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
                  <span className="text-type-secondary font-bold">Total</span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Based on total rewards"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-4xl uppercase">
                    {showToken(100, 'lore')}
                  </span>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 max-w-screen-lg">
          <div className="flex justify-center mb-8">
            {/* <button
              onClick={() => {
                setCurrentTab('open');
                setOffset(0);
                setBounties([]);
              }}
              className={`px-4 py-2 mx-2 ${
                currentTab === 'open'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              } rounded-lg`}
            >
              Open
            </button> */}
            {/* <button
              onClick={() => {
                setCurrentTab('closed');
                setOffset(0);
                setBounties([]);
              }}
              className={`px-4 py-2 mx-2 ${
                currentTab === 'closed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              } rounded-lg`}
            >
              Closed
            </button>
            <button
              onClick={() => {
                setCurrentTab('rewarded');
                setOffset(0);
                setBounties([]);
              }}
              className={`px-4 py-2 mx-2 ${
                currentTab === 'rewarded'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              } rounded-lg`}
            >
              Rewarded
            </button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bounties.map((bounty) => (
              <BountyCard
                key={bounty.id}
                bounty={bounty}
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
