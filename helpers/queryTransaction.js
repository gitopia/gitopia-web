import { useQuery, useSubscription, gql } from "@apollo/client";

/*const QUERY_TRANSACTIONS = gql`
  query MyQuery {
    transaction(order_by: { height: desc }) {
      hash
      messages
    }
  }
`;

function QueryTransaction() {
  const { loading, error, data } = useQuery(QUERY_TRANSACTIONS);

  if (loading) {
    console.log("fetching....");
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  console.log(data);
  return null;
}
*/
const TRANSACTIONS_SUBSCRIPTION = gql`
  subscription MySubscription {
    transaction(order_by: { height: desc }) {
      hash
      messages
    }
  }
`;

function QueryTransaction() {
  const { loading, error, data } = useSubscription(TRANSACTIONS_SUBSCRIPTION);

  if (loading) {
    console.log("fetching....");
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  console.log(data);
  return null;
}

export default QueryTransaction;
