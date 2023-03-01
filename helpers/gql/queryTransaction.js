import { useQuery, gql } from "@apollo/client";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/router";
function QueryTransaction(props) {
  const router = useRouter();

  const QUERY_TRANSACTIONS = gql`
    query MyQuery($creatorId: String!, $startDate: String!) {
      dailyUserEventCounts(
        orderBy: date
        orderDirection: desc
        where: { creator: $creatorId, date_gt: $startDate }
      ) {
        count
        date
      }
    }
  `;

  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  const { loading, error, data } = useQuery(QUERY_TRANSACTIONS, {
    variables: {
      creatorId: props.address,
      startDate: dayjs(dayjs().subtract(1, "year"))
        .format("YYYY-MM-DD")
        .toString(),
    },
  });
  let count = 0;
  if (loading) {
    return null;
  }
  if (error) {
    console.error(error);
    return null;
  }
  props.setContributions(data?.dailyUserEventCounts);
  data?.dailyUserEventCounts.map((tx) => {
    count = count + tx.count;
  });
  props.setTotalContributions(count);
  return null;
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {})(QueryTransaction);
