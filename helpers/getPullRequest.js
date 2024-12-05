export default async function getPullRequest(
  apiClient,
  id,
  repositoryName,
  pullIid
) {
  try {
    const res = await apiClient.queryRepositoryPullRequest(
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
