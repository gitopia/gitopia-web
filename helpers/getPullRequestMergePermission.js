export default async function getPullRequestMergePermission(
  apiClient,
  userAddress,
  repositoryId,
  pullIid
) {
  try {
    const res =
      await apiClient.gitopia.gitopia.gitopia.pullRequestMergePermission({
        userAddress,
        repositoryId,
        pullIid,
      });
    return res;
  } catch (e) {
    console.error(e);
  }
}
