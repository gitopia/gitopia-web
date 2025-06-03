export default async function getRepository(apiClient, repoId) {
  if (!repoId) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repository({
      id: repoId,
    });
    return res.Repository;
  } catch (e) {
    console.log("Not found repository", repoId);
  }
}
