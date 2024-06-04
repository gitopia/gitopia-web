export default async function getIssueComment(
  apiClient,
  repositoryId,
  issueIid,
  commentIid
) {
  if (!repositoryId || !issueIid || !commentIid) return null;
  try {
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
