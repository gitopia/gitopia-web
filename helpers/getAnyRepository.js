export default async function getAnyRepository(
  apiClient,
  usernameOrAddress,
  repositoryName
) {
  if (!usernameOrAddress || !repositoryName) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.anyRepository({
      id: usernameOrAddress,
      repositoryName,
    });
    return res.Repository;
  } catch (e) {
    console.error(e);
  }
}
