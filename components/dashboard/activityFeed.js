import { useMemo, useState } from "react";
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
    query Activity($skip: Int = 0, $after: String = "") {
      _meta {
        block {
          number
        }
      }
      feedItems(
        first: 10
        skip: $skip
        orderBy: feedScore
        orderDirection: desc
        where: { updatedAt_gt: $after }
      ) {
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
          mergedAt
          mergedBy
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
  let time = dayjs().subtract(1, "M").unix();
  const { data, error, loading, fetchMore } = useQuery(QUERY_ACTIVTY, {
    client: client,
    variables: { skip: offset, after: time.toString() },
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
  };

  const getRepoHeader = (r) => {
    if (!r) return "";
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
          avatarSize="sm"
          initialData={ownerData}
          autoLoad={false}
        />
        <div className="mx-2 text-type-tertiary">/</div>
        <Link href={r.ownerId + "/" + r.name}>
          <div className="text-primary">{r.name}</div>
        </Link>
        <div className="flex-1"></div>
      </div>
    );
  };

  const getRepositoryCard = (r, i) => {
    return (
      <div className="p-4 my-0" key={"feedRepo" + i}>
        {getRepoHeader(r)}
        <div className="p-2 mx-8 text-sm text-type-secondary max-w-2xl truncate">
          {r.description}
        </div>
      </div>
    );
  };

  const getIssueCard = (p, i) => {
    return (
      <div className="p-4 my-4" key={"feedIssue" + i}>
        {getRepoHeader(p?.repository?.repository)}
        <div className="flex mt-2">
          <div className="text-neutral ml-1 mr-3">
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
              className="max-w-2xl"
            >
              <span className="text-type-primary">{p?.title}</span>
              <span className="text-neutral ml-2">#{p?.iid}</span>
            </Link>
            {p?.description ? (
              <div className="text-type-secondary text-xs mt-2 truncate max-w-2xl">
                {p?.description}
              </div>
            ) : (
              ""
            )}
            <div className="text-type-secondary text-xs mt-2">
              <span className="mr-1">
                {p?.state == "OPEN" ? "Opened by" : "Closed by"}
              </span>
              <AccountCard
                id={p?.owner?.user?.username}
                initialData={p?.owner?.user}
                avatarSize="xxs"
                showAvatar={false}
                showId={true}
              />
              <span className="ml-1">
                {p?.state == "OPEN"
                  ? dayjs(p?.createdAt * 1000).fromNow()
                  : dayjs(p?.closedAt * 1000).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getPullRequestCard = (p, i) => {
    return (
      <div className="p-4 my-4" key={"feedPull" + i}>
        {getRepoHeader(p?.baseRepository?.repository)}
        <div className="flex mt-2">
          <div className="text-neutral ml-1 mr-3">
            <svg
              viewBox="-2 -2 26 26"
              fill="currentColor"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="8.5" cy="18.5" r="2.5" fill="currentColor" />
              <circle cx="8.5" cy="5.5" r="2.5" fill="currentColor" />
              <path
                d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <Link
              href={[
                "",
                p?.baseRepository?.repository?.ownerId,
                p?.baseRepository?.repository?.name,
                "pulls",
                p?.iid,
              ].join("/")}
              className="max-w-2xl"
            >
              <span className="text-type-primary">{p?.title}</span>
              <span className="text-neutral ml-2">#{p?.iid}</span>
            </Link>
            {p?.description ? (
              <div className="text-type-secondary text-xs mt-2 truncate max-w-2xl">
                {p?.description}
              </div>
            ) : (
              ""
            )}
            <div className="text-type-secondary text-xs mt-2">
              {p?.state == "OPEN" ? (
                <>
                  <span className="mr-1">Opened by</span>
                  <AccountCard
                    id={p?.owner?.user?.username}
                    initialData={p?.owner?.user}
                    avatarSize="xxs"
                    showAvatar={false}
                    showId={true}
                  />
                  <span className="ml-1">
                    {dayjs(p?.createdAt * 1000).fromNow()}
                  </span>
                </>
              ) : p?.state == "CLOSED" ? (
                <>
                  <span className="mr-1">Closed by</span>
                  <AccountCard
                    id={p?.closedBy}
                    avatarSize="xxs"
                    showAvatar={false}
                    showId={true}
                  />
                  <span className="ml-1">
                    {dayjs(p?.closedAt * 1000).fromNow()}
                  </span>
                </>
              ) : (
                <>
                  <span className="mr-1">Merged by</span>
                  <AccountCard
                    id={p?.mergedBy}
                    avatarSize="xxs"
                    showAvatar={false}
                    showId={true}
                  />
                  <span className="ml-1">
                    {dayjs(p?.mergedAt * 1000).fromNow()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBountyCard = (p, i) => {
    return <div key={"feedBounty" + i}>Bounty</div>;
  };

  return (
    <div className="max-w-screen-lg">
      <div className="px-4 text-xs text-type-tertiary font-bold uppercase">
        Trending on Gitopia
      </div>
      <InfiniteScroll
        dataLength={feed.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        style={{ overflow: "hidden" }}
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
      </InfiniteScroll>
      <div className="text-xs text-type-tertiary px-4">
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
