export default async function getAnyRepositoryAll(
  apiClient,
  usernameOrAddress
) {
  if (!usernameOrAddress) return null;
  try {
    const res = await apiClient.queryAnyRepositoryAll(usernameOrAddress);
    if (res.status === 200) {
      return res.data.Repository;
    }
    return [];
  } catch (e) {
    console.error(e);
  }
}
