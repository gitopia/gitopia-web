import { useApiClient } from "../context/ApiClientContext";

export default async function getPullRequest(id, repositoryName, pullIid) {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryRepositoryPullRequest(
      id,
      repositoryName,
      pullIid
    );
    if (res.status === 200) {
      let i = res.data.PullRequest;
      return i;
    }
  } catch (e) {
    console.error(e);
  }
}
