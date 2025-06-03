export default async function getIssueComment(
  apiClient,
  repositoryId,
  issueIid,
  commentIid
) {
  if (!repositoryId || !issueIid || !commentIid) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.issueComment({
      repositoryId,
      issueIid,
      commentIid,
    });
    return res.Comment;
  } catch (e) {
    console.error(e);
  }
}
