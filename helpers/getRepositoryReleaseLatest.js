export default async function getRepositoryReleaseLatest(
  apiClient,
  id,
  repositoryName
) {
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repositoryReleaseLatest(
      { id, repositoryName }
    );
    return res.Release;
  } catch (e) {
    console.error(e);
  }
}
