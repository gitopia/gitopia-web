import { useApiClient } from "../context/ApiClientContext";

export default async function getPullRequestMergePermission(
  userAddress,
  repositoryId,
  pullIid
) {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryPullRequestMergePermission(
      userAddress,
      repositoryId,
      pullIid
    );
    if (res.status === 200) {
      return res.data;
    }
  } catch (e) {
    console.error(e);
  }
}
