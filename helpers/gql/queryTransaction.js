import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/router";
function QueryTransaction(props) {
  const router = useRouter();

  const QUERY_TRANSACTIONS = gql`
    query UserEvents(
      $address: String = ""
      $types: [String!] = [""]
      $createdAtStart: String = ""
    ) {
      userEvents(
        orderBy: createdAt
        orderDirection: desc
        where: {
          creator: $address
          message_in: $types
          createdAt_gt: $createdAtStart
        }
      ) {
        id
        txHash
        creator
        message
        createdAt
      }
    }
  `;

  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  const { loading, error, data } = useQuery(QUERY_TRANSACTIONS, {
    variables: {
      address: props.address,
      types: [
        "MultiSetRepositoryBranch",
        "MultiSetRepositoryTag",
        "CreateIssue",
        "CreatePullRequest",
        "CreateComment",
      ],
      createdAtStart: dayjs(dayjs().subtract(1, "year")).unix().toString(),
    },
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
    console.error(error);
    return null;
  }
  console.log(data);
  let contributions = {};
  data.userEvents.map((tx) => {
    let date = dayjs.unix(tx.createdAt).format("YYYY-MM-DD");
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
