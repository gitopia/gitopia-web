import api from "./getApi";

export default async function getIssueComment(
  repositoryId,
  issueIid,
  commentIid
) {
  if (!repositoryId || !issueIid || !commentIid) return null;
  try {
    const res = await api.queryIssueComment(repositoryId, issueIid, commentIid);
    if (res.status === 200) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
