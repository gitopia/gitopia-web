import { useApiClient } from "../context/ApiClientContext";

export default async function getIssue(id, repositoryName, issueIid) {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryRepositoryIssue(
      id,
      repositoryName,
      issueIid
    );
    if (res.status === 200) {
      let i = res.data.Issue;
      return i;
    }
  } catch (e) {
    console.error(e);
  }
}
