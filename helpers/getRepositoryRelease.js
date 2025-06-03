export default async function getRepositoryRelease(
  apiClient,
  id,
  repositoryName,
  tagName
) {
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repositoryRelease({
      id,
      repositoryName,
      tagName,
    });
    return res.Release;
  } catch (e) {
    console.error(e);
  }
}
