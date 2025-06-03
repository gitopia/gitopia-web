export default async function getIssueCommentAll(
  apiClient,
  repositoryId,
  issueIid
) {
  if (!repoId || !issueIid) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.issueCommentAll({
      repositoryId,
      issueIid,
    });
    return res.Comment;
  } catch (e) {
    console.error(e);
  }
}
