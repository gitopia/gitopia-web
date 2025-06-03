export default async function getPullRequestCommentAll(
  apiClient,
  repositoryId,
  pullRequestIid
) {
  if (!repositoryId || !pullRequestIid) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.pullRequestCommentAll({
      repositoryId,
      pullRequestIid,
    });
    return res.Comment;
  } catch (e) {
    console.error(e);
  }
}
