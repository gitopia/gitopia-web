import { useMemo, useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import client from "../../helpers/apolloClient";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";

import getBountyCard from "./bountyCard";

function BountyFeed({ ...props }) {
  const QUERY_BOUNTY = gql`
    query BountiesFeed($skip: Int = 0) {
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
            state
            iid
          }
        }
        updatedAt
      }
    }
  `;

  const [feed, setFeed] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  let time = dayjs().subtract(3, "M").unix();
  const { data, error, loading, fetchMore } = useQuery(QUERY_BOUNTY, {
    client: client,
    variables: { skip: offset },
    onCompleted: (data) => {
      if (!feed.length) {
        setFeed(data.bounties);
        setOffset(data.bounties.length);
      }
    },
  });

  const loadMore = async () => {
    const { data } = await fetchMore({
      variables: { skip: offset },
    });
    if (!data.bounties.length) setHasMore(false);
    setFeed((prevFeedItems) => [...prevFeedItems, ...data.bounties]);
    setOffset((prevOffset) => prevOffset + data.bounties.length);
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
          return getBountyCard(f, i);
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
})(BountyFeed);
