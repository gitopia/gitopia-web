import api from "./getApi";

export default async function getPullRequestComment(
  repositoryId,
  pullRequestIid,
  commentIid
) {
  if (!repositoryId || !pullRequestIid || !commentIid) return null;
  try {
    const res = await api.queryPullRequestComment(
      repositoryId,
      pullRequestIid,
      commentIid
    );
    if (res.ok) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
