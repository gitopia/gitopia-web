export default async function getPullRequestComment(
  apiClient,
  repositoryId,
  pullRequestIid,
  commentIid
) {
  if (!repositoryId || !pullRequestIid || !commentIid) return null;
  try {
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
