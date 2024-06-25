import { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "../../styles/leaderboard/homepage.module.css";
import Head from "next/head";
import Header from "../../components/header";
import AccountCard from "../../components/account/card";
import AccountAvatar from "../../components/account/avatar";
import UserUsername from "../../components/user/username";
import Footer from "../../components/landingPageFooter";
import showToken from "../../helpers/showToken";
import { useQuery, gql } from "@apollo/client";
import client from "../../helpers/apolloClient";
import debounce from "lodash/debounce";
import { coingeckoId } from "../../ibc-assets-config";
import dayjs from "dayjs";
import { useApiClient } from "../../context/ApiClientContext";
import getDenomNameByHash from "../../helpers/getDenomNameByHash";
import getBountyValueInDollars from "../../helpers/getBountyValueInDollars";
import ReactMarkdown from "react-markdown";

const QUERY_BOUNTY = gql`
  query Bounties($skip: Int = 0) {
    _meta {
      block {
        number
      }
    }
    bounties(
      first: 10
      skip: $skip
      orderBy: expireAt
      orderDirection: desc
      where: { repository_in: ["R5", "R6", "R7"] }
    ) {
      id
      state
      amount {
        amount
        denom
      }
      updatedAt
      expireAt
      repository {
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
      parentIssue {
        issue {
          title
          description
          state
          iid
        }
      }
      updatedAt
    }
  }
`;

const BountyCard = ({ bounty }) => (
  <a
    href={`${bounty.repository.owner.owner.address}/${bounty.repository.name}/issues/${bounty.parentIssue.issue.iid}`}
    className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-4"
  >
    <div className="mb-4">
      {bounty.amount.map((c, index) => (
        <div key={index} className="mb-2">
          <div className="text-type-secondary">
            <div className="flex text-sm items-center">
              <div className="mr-1.5">
                <img
                  src={coingeckoId[c.denomName].icon}
                  width={24}
                  height={24}
                  alt={c.denomName}
                />
              </div>
              <div className="uppercase ml-1 mr-3 text-xs">
                {coingeckoId[c.denomName].coinDenom}
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
              <div className="ml-3 text-xs">{c.amount.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="ml-2 font-bold text-xs text-type-tertiary">
        ≈${bounty.dollarAmount} USD
      </div>
    </div>

    <h6 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
      {bounty.parentIssue.issue.title}
    </h6>
    <p className="font-normal text-gray-700 dark:text-gray-400">
      <ReactMarkdown>
        {bounty.parentIssue.issue.description?.slice(0, 250)}
      </ReactMarkdown>
    </p>
    <div className="mt-2 flex justify-between items-center text-gray-600 dark:text-gray-400">
      <span>{dayjs.unix(bounty.updatedAt).fromNow()}</span>
    </div>
  </a>
);

function Bounties() {
  const [bounties, setBounties] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ibcAppTransferApiClient } = useApiClient();

  const { data, error, loading, fetchMore } = useQuery(QUERY_BOUNTY, {
    client: client,
    variables: { skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && data.bounties) {
      processBounties(data.bounties);
    }
  }, [data]);

  const processBounties = async (bounties) => {
    const processedBounties = await Promise.all(
      bounties.map(async (bounty) => ({
        ...bounty,
        amount: await Promise.all(
          bounty.amount.map(async (c) => {
            const denomName = c.denom.includes("ibc")
              ? await getDenomNameByHash(ibcAppTransferApiClient, c.denom)
              : c.denom;

            return {
              ...c,
              amount:
                parseFloat(c.amount) /
                Math.pow(10, coingeckoId[denomName].coinDecimals),
              denomName: denomName,
            };
          })
        ),
        dollarAmount: await getBountyValueInDollars(
          ibcAppTransferApiClient,
          bounty
        ),
      }))
    );
    console.log("processed", processedBounties);
    setBounties((prevBounties) => [...prevBounties, ...processedBounties]);
    setOffset((prevOffset) => prevOffset + bounties.length);
    setHasMore(bounties.length === 10);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMore({
        variables: { skip: offset },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            bounties: [...prev.bounties, ...fetchMoreResult.bounties],
          };
        },
      }).then(({ data }) => {
        if (data && data.bounties) {
          processBounties(data.bounties);
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
      <section className={"relative mt-12 flex flex-col items-center lg:mt-16"}>
        <div className="w-full max-w-screen-lg items-center">
          <div className="p-4 pt-8 lg:p-0">
            <div className="text-4xl font-bold tracking-tight lg:text-center lg:text-5xl">
              Bounties
            </div>
          </div>
          <div className="border-grey-50 bg-base-200/70 relative mx-4 mt-12 max-w-2xl rounded-xl border text-sm lg:mx-auto lg:mt-16">
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
                  <span className="text-4xl uppercase">{}</span>
                </div>
              </div>
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
                  <span className="text-type-secondary font-bold">Value</span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Total bounties claimed by you"
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
                  <span className="text-4xl uppercase">{}</span>
                </div>
              </div>
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
                  <span className="text-type-secondary font-bold">
                    Rewarded
                  </span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Total rewards received from bounties"
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
                    {showToken(100, "lore")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 max-w-screen-lg">
          {bounties.map((bounty) => (
            <BountyCard key={bounty.id} bounty={bounty} />
          ))}
          {loading && <p>Loading more bounties...</p>}
          {hasMore && !loading && (
            <button
              onClick={loadMore}
              className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Load More
            </button>
          )}
        </div>

        <img
          className={
            "pointer-events-none absolute bottom-2/3 right-10 -z-10 w-3/4 opacity-50 sm:mb-14"
          }
          src="/rewards/objects.svg"
        />
        <img
          className={
            "pointer-events-none absolute bottom-1/3 -z-20 mb-96 w-full opacity-50 lg:mb-48 2xl:mb-10"
          }
          src="/rewards/ellipse.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-2/3 -z-20 w-full opacity-50 sm:visible lg:bottom-1/3 lg:mb-48"
          }
          src="/rewards/stars-3.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-3/4 left-5 -z-20 mt-20 opacity-30 lg:visible"
          }
          src="/rewards/coin-1.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute -top-36 right-0 -z-20 opacity-30 sm:visible lg:-top-20"
          }
          src="/rewards/coin-2.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-2/3 left-36 -z-20 opacity-30 lg:visible"
          }
          src="/rewards/coin-3.png"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-1/2 right-36 -z-20 mb-28 opacity-30 lg:visible"
          }
          src="/rewards/coin-4.svg"
        />
      </section>

      <Footer />
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(Bounties);
