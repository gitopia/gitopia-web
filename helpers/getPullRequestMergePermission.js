export default async function getPullRequestMergePermission(
  apiClient,
  userAddress,
  repositoryId,
  pullIid
) {
  try {
    const res = await apiClient.queryPullRequestMergePermission(
      userAddress,
      repositoryId,
      pullIid
    );
    if (res.status === 200) {
      return res.data;
    }
  } catch (e) {
    console.error(e);
  }
}
