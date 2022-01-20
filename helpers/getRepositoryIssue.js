import api from "./getApi";

export default async function getRepositoryIssue(id, repoName, issueIid) {
  try {
    const res = await api.queryRepositoryIssue(id, repoName, issueIid);
    if (res.ok) {
      return res.data.Issue;
    }
  } catch (e) {
    console.error(e);
  }
}
