import { useQuery, gql } from "@apollo/client";
const QUERY_TRANSACTIONS = gql`
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

export default QueryTransaction;
