import api from "./getApi";

export default async function getPullRequest(id, repositoryName, pullIid) {
  try {
    const res = await api.queryPullRequest(id, repositoryName, pullIid);
    if (res.ok) {
      let i = res.data.PullRequest;
      return i;
    }
  } catch (e) {
    console.error(e);
  }
}
