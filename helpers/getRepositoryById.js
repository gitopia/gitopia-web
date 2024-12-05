export default async function getRepositoryById(apiClient, repositoryId) {
  if (!repositoryId) return null;
  try {
    const res = await apiClient.queryRepository(repositoryId);
    if (res.status === 200) {
      return res.data.Repository;
    }
  } catch (e) {
    console.error(e);
  }
}
