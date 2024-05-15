import { useApiClient } from "../context/ApiClientContext";

export default async function getPullRequestComment(
  repositoryId,
  pullRequestIid,
  commentIid
) {
  if (!repositoryId || !pullRequestIid || !commentIid) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryPullRequestComment(
      repositoryId,
      pullRequestIid,
      commentIid
    );
    if (res.status === 200) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
