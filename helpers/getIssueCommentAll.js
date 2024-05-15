import { useApiClient } from "../context/ApiClientContext";

export default async function getIssueCommentAll(repoId, issueIid) {
  if (!repoId || !issueIid) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryIssueCommentAll(repoId, issueIid);
    if (res.status === 200) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
