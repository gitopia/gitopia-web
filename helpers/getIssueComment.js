import { useApiClient } from "../context/ApiClientContext";

export default async function getIssueComment(
  repositoryId,
  issueIid,
  commentIid
) {
  if (!repositoryId || !issueIid || !commentIid) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryIssueComment(
      repositoryId,
      issueIid,
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
