import { useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import AccountCard from "../account/card";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import client from "../../helpers/apolloClient";
import Link from "next/link";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";

function ActivityFeed({ ...props }) {
  const QUERY_ACTIVTY = gql`
    query Activity($skip: Int = 0) {
      _meta {
        block {
          number
        }
      }
      feedItems(first: 10, skip: $skip, orderBy: feedScore, orderDirection: desc) {
        feedScore
        ... on Repository {
          __typename
          name
          description
          ownerId
          forksCount
          issuesCount
          pullsCount
          updatedAt
          allowForking
          owner {
            owner {
              ... on Dao {
                id
                address
                avatarUrl
                username
                verified
                name
                description
                members {
                  id
                  user {
                    address
                    avatarUrl
                    description
                    name
                    username
                  }
                }
              }
              ... on User {
                name
                address
                avatarUrl
                description
                username
              }
            }
          }
          collaborators {
            user {
              address
              avatarUrl
              description
              name
              username
            }
          }
        }
        ... on PullRequest {
          __typename
          commentsCount
          createdAt
          creator
          description
          id
          iid
          labels {
            label {
              color
              createdAt
              description
              name
            }
          }
          state
          title
          updatedAt
          closedAt
          closedBy
          baseRepository {
            repository {
              name
              ownerId
              owner {
                owner {
                  username
                  avatarUrl
                  name
                  description
                  address
                }
              }
              allowForking
            }
          }
          headRepository {
            repository {
              name
              ownerId
              owner {
                owner {
                  username
                  avatarUrl
                  name
                  description
                  address
                }
              }
              allowForking
            }
          }
          owner {
            user {
              avatarUrl
              username
              description
              address
              name
            }
          }
        }
        ... on Issue {
          __typename
          commentsCount
          createdAt
          creator
          description
          id
          iid
          labels {
            label {
              color
              createdAt
              description
              name
            }
          }
          repositoryId
          state
          title
          updatedAt
          closedAt
          closedBy
          repository {
            repository {
              name
              ownerId
              owner {
                owner {
                  username
                  avatarUrl
                  name
                  description
                  address
                }
              }
              allowForking
            }
          }
          owner {
            user {
              avatarUrl
              username
              description
              address
              name
            }
          }
        }
        ... on Bounty {
          __typename
          id
          state
          amount {
            amount
            denom
          }
          expireAt
        }
        updatedAt
      }
    }
  `;

  const [feed, setFeed] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { data, error, loading, fetchMore } = useQuery(QUERY_ACTIVTY, {
    client: client,
    variables: { skip: offset },
    onCompleted: (data) => {
      if (!feed.length) {
        setFeed(data.feedItems);
        setOffset(data.feedItems.length);
      }
    },
  });

  const loadMore = async () => {
    const { data } = await fetchMore({
      variables: { skip: offset },
    });
    if (!data.feedItems.length) setHasMore(false);
    setFeed((prevFeedItems) => [...prevFeedItems, ...data.feedItems]);
    setOffset((prevOffset) => prevOffset + data.feedItems.length);
  }

  const getRepoHeader = (r) => {
    let ownerData = { ...r.owner?.owner };
    if (ownerData) {
      ownerData.id = ownerData.address;
    }
    return (
      <div className="flex items-center">
        <AccountCard
          id={r.ownerId}
          showId={true}
          showAvatar={true}
          avatarSize="xs"
          initialData={ownerData}
          autoLoad={false}
        />
        <div className="mx-2 text-type-tertiary">/</div>
        <Link href={r.ownerId + "/" + r.name}>
          <div className="text-primary">{r.name}</div>
        </Link>
        <div className="flex-1"></div>
        <div className="flex-none btn-group">
          <Link
            className="btn btn-xs btn-ghost border-grey-50"
            data-test="fork-repo"
            href={["", r.ownerId, r.name, "fork"].join("/")}
            disabled={!r.allowForking}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-2"
              stroke="currentColor"
            >
              <path
                d="M11.9998 12.5L6.49982 12.5L6.49982 5.5M11.9998 12.5L17.4998 12.5L17.4998 5.5M11.9998 12.5L11.9998 17.5"
                strokeWidth="2"
                fill="none"
              />
              <path d="M14.4998 19.5C14.4998 20.8807 13.3805 22 11.9998 22C10.6191 22 9.49982 20.8807 9.49982 19.5C9.49982 18.1193 10.6191 17 11.9998 17C13.3805 17 14.4998 18.1193 14.4998 19.5Z" />
              <circle cx="6.49982" cy="5.5" r="2.5" />
              <circle cx="17.4998" cy="5.5" r="2.5" />
            </svg>

            <span>FORKS</span>
          </Link>
          <button
            className="btn btn-xs btn-ghost border-grey-50"
            href={["", r.ownerId, r.name, "insights"].join("/")}
            disabled={!r.allowForking}
          >
            {r.forksCount || 0}
          </button>
        </div>
      </div>
    );
  };

  const getRepositoryCard = (r, i) => {
    return (
      <div
        className="p-4 my-4 border border-grey-50 rounded-md"
        key={"feedRepo" + i}
      >
        {getRepoHeader(r)}
        <div className="mx-6 px-2 mt-2 text-sm text-type-secondary max-w-2xl truncate">
          {r.description}
        </div>
      </div>
    );
  };

  const getIssueCard = (p, i) => {
    return (
      <div
        className="p-4 my-4 border border-grey-50 rounded-md"
        key={"feedIssue" + i}
      >
        {getRepoHeader(p?.repository?.repository)}
        <div className="flex mt-2">
          <div className="text-neutral mr-2">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                transform="translate(0,2)"
                d="M5.93782 16.5L12 6L18.0622 16.5H5.93782Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
              />
            </svg>
          </div>
          <div>
            <Link
              href={[
                "",
                p?.repository?.repository?.ownerId,
                p?.repository?.repository?.name,
                "issues",
                p?.iid,
              ].join("/")}
            >
              <span className="text-type-primary">{p?.title}</span>
              <span className="text-neutral ml-2">#{p?.iid}</span>
            </Link>
            <div className="text-type-secondary text-xs">{p?.description}</div>
            <div className="text-type-secondary text-xs mt-2">
              <span className="mr-1">{p?.state == "OPEN" ? "Opened by" : "Closed by"}</span>
              <AccountCard
                id={p?.owner?.user?.username}
                initialData={p?.owner?.user}
                avatarSize="xxs"
                showAvatar={false}
                showId={true}
              />
              <span className="ml-1">{ p?.state == "OPEN" ? dayjs(p?.createdAt * 1000).fromNow() : dayjs(p?.closedAt * 1000).fromNow()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getPullRequestCard = (p, i) => {
    return <div key={"feedPull" + i}>PR</div>;
  };

  const getBountyCard = (p, i) => {
    return <div key={"feedBounty" + i}>Bounty</div>;
  };

  return (
    <div className="max-w-2xl">
      <div className="text-xl">Explore Gitopia</div>
      <InfiniteScroll
        dataLength={feed.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        style={{overflow:"hidden"}}
        scrollableTarget={() => {
          typeof window !== "undefined" ? window.document : null;
        }}
      >
        {feed.map((f, i) => {
          if (f.__typename === "Repository") {
            return getRepositoryCard(f, i);
          } else if (f.__typename === "Issue") {
            return getIssueCard(f, i);
          } else if (f.__typename === "PullRequest") {
            return getPullRequestCard(f, i);
          } else if (f.__typename === "Bounty") {
            return getBountyCard(f, i);
          }
        })}
        <div className="pb-52"></div>
      </InfiniteScroll>
      <div className="text-xs text-type-tertiary">
        {"Synced data till block " + data?._meta?.block?.number}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  notify,
})(ActivityFeed);
