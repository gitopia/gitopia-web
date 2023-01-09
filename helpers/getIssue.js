import api from "./getApi";

export default async function getIssue(id, repositoryName, issueIid) {
  try {
    const res = await api.queryRepositoryIssue(id, repositoryName, issueIid);
    if (res.ok) {
      let i = res.data.Issue;
      return i;
    }
  } catch (e) {
    console.error(e);
  }
}
