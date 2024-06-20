export default async function getPullRequestCommentAll(
  apiClient,
  repositoryId,
  pullRequestIid
) {
  if (!repositoryId || !pullRequestIid) return null;
  try {
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
