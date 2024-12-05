export default async function getRepositoryRelease(
  apiClient,
  id,
  repoName,
  tagName
) {
  try {
    const res = await apiClient.queryRepositoryRelease(id, repoName, tagName);
    if (res.status === 200) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
