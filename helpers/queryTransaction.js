import { useQuery, useSubscription, gql } from "@apollo/client";
import { useEffect } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/router";
function QueryTransaction(props) {
  const router = useRouter();
  const QUERY_TRANSACTIONS = gql`
  query UserContributionsByBlockTime {
    transaction(
      limit: 100
      where: {
        messagesByTransactionHash: {
          type: {
            _in: [
              "gitopia.gitopia.gitopia.MsgMultiSetRepositoryBranch"
              "gitopia.gitopia.gitopia.MsgMultiSetRepositoryTag"
              "gitopia.gitopia.gitopia.MsgCreatePullRequest"
              "gitopia.gitopia.gitopia.MsgCreateIssue"
              "gitopia.gitopia.gitopia.MsgCreateComment"
            ]
          }
          involved_accounts_addresses: {
            _eq: "{${router.query.userId}}"
          }
        }
      }
      order_by: { block: { timestamp: desc } }
    ) {
      block {
        timestamp
      }
    }
  }
`;
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  const { loading, error, data } = useQuery(QUERY_TRANSACTIONS);
  let contributionValues = [];
  let count = 0;
  useEffect(() => {
    props.setContributions(contributionValues);
    props.setTotalContributions(count);
  }, [data]);

  if (loading) {
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  let contributions = {};
  data.transaction.map((tx) => {
    let date = dayjs(tx.block.timestamp).format("YYYY-MM-DD");
    if (date in contributions) {
      contributions[date]++;
    } else {
      contributions[date] = 1;
    }
  });
  for (let i in contributions) {
    contributionValues.push({ date: i, count: contributions[i] });
    count = count + contributions[i];
  }

  return null;
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {})(QueryTransaction);
