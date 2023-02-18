import api from "./getApi";

export default async function getPullRequest(id, repositoryName, pullIid) {
  try {
    const res = await api.queryRepositoryPullRequest(
      id,
      repositoryName,
      pullIid
    );
    if (res.status === 200) {
      let i = res.data.PullRequest;
      return i;
    }
  } catch (e) {
    console.error(e);
  }
}
