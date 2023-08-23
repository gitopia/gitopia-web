import { useMemo, useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import AccountCard from "../account/card";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import client from "../../helpers/apolloClient";
import Link from "next/link";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import getTokenValueInDollars from "../../helpers/getTotalTokenValueInDollars";
import pluralize from "../../helpers/pluralize";

function ActivityFeed({ ...props }) {
  const QUERY_ACTIVTY = gql`
    query Activity($skip: Int = 0, $after: Int = 0) {
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
          forksCount
          openIssuesCount
          openPullsCount
          pushedAt
          allowForking
          ownerId
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
          description
          id
          iid
          state
          title
          closedAt
          closedBy {
            username
            avatarUrl
            name
            description
            address
          }
          mergedAt
          mergedBy {
            username
            avatarUrl
            name
            description
            address
          }
          baseRepository {
            repository {
              name
              allowForking
              forksCount
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
            }
          }
          headRepository {
            repository {
              name
              allowForking
              forksCount
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
          description
          id
          iid
          repositoryId
          state
          title
          closedAt
          closedBy {
            username
            avatarUrl
            name
            description
            address
          }
          repository {
            repository {
              name
              allowForking
              forksCount
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
              state
              iid
            }
          }
        }
        ... on Release {
          id
          name
          description
          tagName
          repository {
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
          }
          attachments {
            name
          }
          description
          draft
        }
        updatedAt
      }
    }
  `;

  const [feed, setFeed] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  let time = dayjs().subtract(3, "M").unix();
  const { data, error, loading, fetchMore } = useQuery(QUERY_ACTIVTY, {
    client: client,
    variables: { skip: offset, after: time },
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
    let ownerData = { ...r.owner?.owner, ...r.owner?.user };
    if (ownerData) {
      ownerData.id = ownerData.address;
    }
    return (
      <div className="flex items-center mb-2">
        <AccountCard
          id={ownerData?.id}
          showId={true}
          showAvatar={true}
          avatarSize="sm"
          initialData={ownerData}
          autoLoad={false}
        />
        <div className="mx-2 text-type-tertiary">/</div>
        <Link href={ownerData?.id + "/" + r.name}>
          <div className="text-primary">{r.name}</div>
        </Link>
        <div className="flex-1"></div>
        <div className="flex-none btn-group">
          <Link
            className="btn btn-xs btn-ghost border-grey-50"
            data-test="fork-repo"
            href={["", ownerData?.id, r.name, "fork"].join("/")}
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

            <span>FORK</span>
          </Link>
          <button
            className="btn btn-xs btn-ghost border-grey-50"
            href={["", ownerData?.id, r.name, "insights"].join("/")}
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
      <div className="p-4 my-0" key={"feedRepo" + i}>
        {getRepoHeader(r)}
        {r.description ? (
          <div className="mx-10 mb-2 text-type-primary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
            {r.description}
          </div>
        ) : (
          ""
        )}
        <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl truncate">
          <span>Updated {dayjs(r?.pushedAt * 1000).fromNow()}</span>
          <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
          <span className="capitalize">
            {r.openPullsCount} Open{" "}
            {pluralize("pull request", r.openPullsCount)}
          </span>
          <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
          <span className="capitalize">
            {r.openIssuesCount} Open {pluralize("issue", r.openIssuesCount)}
          </span>
        </div>
      </div>
    );
  };

  const getIssueCard = (p, i) => {
    let ownerData = { ...p.owner?.owner, ...p.owner?.user },
      closerData = { ...p.closedBy };
    if (ownerData) {
      ownerData.id = ownerData.address;
    }
    if (closerData) {
      closerData.id = closerData.address;
    }
    return (
      <div className="p-4 my-4" key={"feedIssue" + i}>
        {getRepoHeader(p?.repository?.repository)}
        <Link
          href={[
            "",
            p?.repository?.repository?.ownerId,
            p?.repository?.repository?.name,
            "issues",
            p?.iid,
          ].join("/")}
          className="mx-10 mb-2 max-w-xs lg:max-w-2xl flex"
        >
          <span className="text-type-primary">{p?.title}</span>
          <span className="text-neutral ml-2">#{p?.iid}</span>
        </Link>
        {p?.description ? (
          <div className="mx-10 mt-2 text-xs text-type-secondary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
            {p?.description}
          </div>
        ) : (
          ""
        )}
        <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl">
          {p?.state == "OPEN" ? (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
                }
              />
              <span>Issue opened by</span>
              <AccountCard
                id={ownerData?.id}
                initialData={ownerData}
                avatarSize="xxs"
                showAvatar={false}
                showId={true}
              />
              <span>{dayjs(p?.createdAt * 1000).fromNow()}</span>
            </>
          ) : (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-red-900"
                }
              />
              <span>Issue closed by</span>
              <AccountCard
                id={closerData?.id}
                initialData={closerData}
                avatarSize="xxs"
                showAvatar={false}
                showId={true}
              />
              <span>{dayjs(p?.closedAt * 1000).fromNow()}</span>
            </>
          )}
          <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
          <span className="capitalize">
            {p?.commentsCount} {pluralize("comment", p?.commentsCount)}
          </span>
        </div>
      </div>
    );
  };

  const getPullRequestCard = (p, i) => {
    let ownerData = { ...p.owner?.owner, ...p.owner?.user },
      closerData = { ...p.closedBy },
      mergerData = { ...p.mergedBy };
    if (ownerData) {
      ownerData.id = ownerData.address;
    }
    if (closerData) {
      closerData.id = closerData.address;
    }
    if (mergerData) {
      mergerData.id = mergerData.address;
    }
    return (
      <div className="p-4 my-4" key={"feedPull" + i}>
        {getRepoHeader(p?.baseRepository?.repository)}
        <Link
          href={[
            "",
            p?.baseRepository?.repository?.ownerId,
            p?.baseRepository?.repository?.name,
            "pulls",
            p?.iid,
          ].join("/")}
          className="mx-10 mb-2 max-w-xs lg:max-w-2xl flex"
        >
          <span className="text-type-primary">{p?.title}</span>
          <span className="text-neutral ml-2">#{p?.iid}</span>
        </Link>
        {p?.description ? (
          <div className="mx-10 mt-2 text-xs text-type-secondary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
            {p?.description}
          </div>
        ) : (
          ""
        )}
        <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl">
          {p?.state == "OPEN" ? (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
                }
              />
              <span>Pull Request opened by</span>
                <AccountCard
                  id={ownerData?.id}
                  initialData={ownerData}
                  avatarSize="xxs"
                  showAvatar={false}
                  showId={true}
                />
              <span>{dayjs(p?.createdAt * 1000).fromNow()}</span>
            </>
          ) : p?.state == "CLOSED" ? (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-red-900"
                }
              />
              <span>Pull Request closed by</span>
                <AccountCard
                  id={closerData?.id}
                  initialData={closerData}
                  avatarSize="xxs"
                  showAvatar={false}
                  showId={true}
                />
              <span>{dayjs(p?.closedAt * 1000).fromNow()}</span>
            </>
          ) : (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-purple-900"
                }
              />
              <span>Pull Request merged by</span>
                <AccountCard
                  id={mergerData?.id}
                  initialData={mergerData}
                  avatarSize="xxs"
                  showAvatar={false}
                  showId={true}
                />
              <span>{dayjs(p?.mergedAt * 1000).fromNow()}</span>
            </>
          )}
          <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
          <span className="capitalize">
            {p?.commentsCount} {pluralize("comment", p?.commentsCount)}
          </span>
        </div>
      </div>
    );
  };

  const getBountyCard = (b, i) => {
    let isExpired = b?.expireAt < dayjs().unix();
    let rewareeData = { ...b?.rewardee }
    if (rewareeData) {
      rewareeData.id = rewareeData.address
    }
    return (
      <div className="p-4 my-0" key={"feedBounty" + i}>
        {getRepoHeader(b?.repository)}
        <Link
          href={[
            "",
            b?.repository?.owner?.id,
            b?.repository?.name,
            "issues",
            b?.parentIssue?.issue?.iid,
          ].join("/")}
          className="mx-10 mb-2 max-w-xs lg:max-w-2xl"
        >
          <span className="text-type-primary">
            {b?.amount?.map((a) => {
              return (
                <>
                  <span className="">
                    {a.amount / 1000000 + " " + a.denom.slice(1).toUpperCase()}
                  </span>
                </>
              );
            })}
          </span>
          {b?.state == "BOUNTY_STATE_DESTCREDITED" ? (
            <>
              <span>Rewared to</span>
              <AccountCard
                id={rewareeData?.id}
                initialData={rewareeData}
                avatarSize="xs"
                showAvatar={true}
                showId={true}
              />
            </>
          ) : (
            ""
          )}
        </Link>
        <div className="mx-10 mt-2 text-xs text-type-secondary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
          {b?.parentIssue?.issue?.title}
        </div>
        <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl">
          {b?.state == "BOUNTY_STATE_REVERTEDBACK" ? (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-red-900"
                }
              />
              <span>
                Bounty reverted {dayjs(b?.updatedAt * 1000).fromNow()}
              </span>
            </>
          ) : (
            ""
          )}
          {b?.state == "BOUNTY_STATE_SRCDEBITTED" ? (
            isExpired ? (
              <>
                <span
                  className={
                    "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-pink-900"
                  }
                />
                <span>
                  Bounty expired {dayjs(b?.expireAt * 1000).fromNow()}
                </span>
              </>
            ) : (
              <>
                <span
                  className={
                    "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
                  }
                />
                <span>
                  Bounty expires in {dayjs(b?.expireAt * 1000).fromNow()}
                </span>
              </>
            )
          ) : (
            ""
          )}
          {b?.state == "BOUNTY_STATE_DESTCREDITED" ? (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
                }
              />
              <span>Bounty rewared {dayjs(b?.updatedAt * 1000).fromNow()}</span>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  const getReleaseCard = (l, i) => {
    return (
      <div className="p-4 my-0" key={"feedBounty" + i}>
        {getRepoHeader(l?.repository?.repository)}
        <Link
          href={[
            "",
            l?.repository?.repository?.ownerId,
            l?.repository?.repository?.name,
            "releases/tag",
            l?.tagName,
          ].join("/")}
          className="mx-10 mb-2 max-w-xs lg:max-w-2xl"
        >
          <span className="text-type-primary">{l?.name}</span>
        </Link>
        {l?.description ? (
          <div className="mx-10 mt-2 text-xs text-type-secondary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
            {l?.description}
          </div>
        ) : (
          ""
        )}
        <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl">
          <span>Released {dayjs(l?.updatedAt * 1000).fromNow()}</span>
          <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
          <span className="capitalize">{l?.attachments?.length} {pluralize("attachment", l?.attachments?.length)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-screen-lg lg:px-4">
      <div className="px-4 text-xs text-type-tertiary font-bold uppercase">
        Trending on Gitopia
      </div>
      <InfiniteScroll
        dataLength={feed.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4 className="text-type-secondary text-xs m-4">Loading...</h4>}
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
          } else if (f.__typename === "Release") {
            return getReleaseCard(f, i);
          }
        })}
        <div className="pt-48"></div>
      </InfiniteScroll>
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
