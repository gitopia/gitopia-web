import api from "./getApi";

export default async function getPullRequestCommentAll(
  repositoryId,
  pullRequestIid
) {
  if (!repositoryId || !pullRequestIid) return null;
  try {
    const res = await api.queryPullRequestCommentAll(
      repositoryId,
      pullRequestIid
    );
    if (res.ok) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
