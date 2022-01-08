import api from "./getApi";

export default async function getRepositoryPullRequest(id, repoName, pullIid) {
  try {
    const res = await api.queryRepositoryPullRequest(id, repoName, pullIid);
    if (res.ok) {
      return res.data.PullRequest;
    }
  } catch (e) {
    console.error(e);
  }
}
