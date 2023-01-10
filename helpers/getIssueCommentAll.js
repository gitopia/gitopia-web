import api from "./getApi";

export default async function getIssueCommentAll(repoId, issueIid) {
  if (!repoId || !issueIid) return null;
  try {
    const res = await api.queryIssueCommentAll(repoId, issueIid);
    if (res.ok) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
