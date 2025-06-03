export default async function getPullRequest(
  apiClient,
  id,
  repositoryName,
  pullIid
) {
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repositoryPullRequest({
      id,
      repositoryName,
      pullIid,
    });
    return res.PullRequest;
  } catch (e) {
    console.error(e);
  }
}
