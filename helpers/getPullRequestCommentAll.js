import { useApiClient } from "../context/ApiClientContext";

export default async function getPullRequestCommentAll(
  repositoryId,
  pullRequestIid
) {
  if (!repositoryId || !pullRequestIid) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryPullRequestCommentAll(
      repositoryId,
      pullRequestIid
    );
    if (res.status === 200) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
