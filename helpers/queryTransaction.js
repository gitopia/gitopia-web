import { useQuery, useSubscription, gql } from "@apollo/client";
import { useEffect } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/router";
function QueryTransaction(props) {
  const router = useRouter();
  const QUERY_TRANSACTIONS = gql`
  query UserContributionsByBlockTime($addresses: _text = "", $types: _text = "") {
  messages_by_address(args: {limit: "10", offset: "0", addresses: $addresses, types: $types}, order_by: {transaction: {block: {timestamp: desc}}}) {
    transaction {
      block {
        timestamp
      }
    }
    value
  }
}

`;
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  const { loading, error, data } = useQuery(QUERY_TRANSACTIONS, {
    variables: {
      addresses: "{" + router.query.userId + "}",
      types: '{"gitopia.gitopia.gitopia.MsgMultiSetRepositoryBranch","gitopia.gitopia.gitopia.MsgMultiSetRepositoryTag", "gitopia.gitopia.gitopia.MsgCreatePullRequest", "gitopia.gitopia.gitopia.MsgCreateIssue", "gitopia.gitopia.gitopia.MsgCreateComment"}'
    }
  });
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
  data.messages_by_address.map((tx) => {
    let date = dayjs(tx.transaction.block.timestamp).format("YYYY-MM-DD");
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
