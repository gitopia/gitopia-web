import { useQuery, gql } from "@apollo/client";
import { connect } from "react-redux";
const QUERY_ISSUES = gql`
  query issuesByTitle($substr: String!, $repoId: Int!) {
    issues(where: { title_contains_nocase: $substr, repositoryid: $repoId }) {
      creator
      title
      repositoryid
      iid
      state
    }
  }
`;

function QueryIssues(props) {
  if (props.substr.length < 3) {
    props.setIssueList([]);
    return null;
  }

  const { loading, error, data } = useQuery(QUERY_ISSUES, {
    variables: { substr: props.substr, repoId: props.repoId },
  });

  if (loading) {
    return null;
  }
  if (error) {
    console.log(error);
    return null;
  }
  props.setIssueList(data.issues);

  return null;
}
const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {})(QueryIssues);
