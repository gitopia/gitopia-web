import api from "./getApi";

export default async function getIssueCommentAll(repositoryId, pullRequestIid) {
  if (!repositoryId || !pullRequestIid) return null;
  try {
    const res = await api.queryIssueCommentAll(repositoryId, pullRequestIid);
    console.log(res);
    if (res.ok) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
