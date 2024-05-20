export default async function getIssueCommentAll(apiClient, repoId, issueIid) {
  if (!repoId || !issueIid) return null;
  try {
    const res = await apiClient.queryIssueCommentAll(repoId, issueIid);
    if (res.status === 200) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
