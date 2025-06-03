export default async function getAnyRepositoryAll(
  apiClient,
  usernameOrAddress
) {
  if (!usernameOrAddress) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.anyRepositoryAll({
      id: usernameOrAddress,
    });
    return res.Repository;
  } catch (e) {
    console.error(e);
  }
}
