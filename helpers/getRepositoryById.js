export default async function getRepositoryById(apiClient, repositoryId) {
  if (!repositoryId) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repository({
      id: repositoryId,
    });
    return res.Repository;
  } catch (e) {
    console.error(e);
  }
}
