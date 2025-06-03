export default async function getPullRequestComment(
  apiClient,
  repositoryId,
  pullRequestIid,
  commentIid
) {
  if (!repositoryId || !pullRequestIid || !commentIid) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.pullRequestComment({
      repositoryId,
      pullRequestIid,
      commentIid,
    });
    return res.Comment;
  } catch (e) {
    console.error(e);
  }
}
