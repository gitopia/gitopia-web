import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";
import { connect } from "react-redux";

const QUERY_USER_TRANSACTIONS = gql`
  query UserEvents($creator: String) {
    userEvents(
      orderBy: createdAt
      orderDirection: desc
      where: { creator: $creator }
    ) {
      id
      txHash
      creator
      message
      createdAt
    }
  }
`;

function QueryUserTransactions(props) {
  const { loading, error, data } = useQuery(QUERY_USER_TRANSACTIONS, {
    variables: { creator: props.creator },
  });

  if (loading) {
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  props.setUserTransactions(data.userEvents);

  return null;
}
const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {})(QueryUserTransactions);
