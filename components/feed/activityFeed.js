import { useMemo, useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import client from "../../helpers/apolloClient";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";

import getRepositoryCard from "./repositoryCard";
import getIssueCard from "./issueCard";
import getPullRequestCard from "./pullRequestCard";
import getBountyCard from "./bountyCard";
import getReleaseCard from "./releaseCard";

function ActivityFeed({ order = "feedScore",...props }) {
  const QUERY_ACTIVTY = gql`
    query Activity($skip: Int = 0, $after: Int = 0, $order: FeedItem_orderBy) {
      _meta {
        block {
          number
        }
      }
      feedItems(
        first: 10
        skip: $skip
        orderBy: $order
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
    variables: { skip: offset, after: time, order: order },
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

  return (
    <div className="max-w-screen-lg lg:px-4">
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
