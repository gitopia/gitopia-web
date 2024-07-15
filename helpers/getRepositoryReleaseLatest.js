export default async function getRepositoryReleaseLatest(
  apiClient,
  id,
  repoName
) {
  try {
    const res = await apiClient.queryRepositoryReleaseLatest(id, repoName);
    if (res.status === 200) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
