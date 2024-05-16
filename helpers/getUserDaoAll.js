export default async function getUserDaoAll(apiClient, usernameOrAddress) {
  if (!usernameOrAddress) return null;
  try {
    const res = await apiClient.queryUserDaoAll(usernameOrAddress);
    if (res.status === 200) {
      return res.data.dao;
    }
    return [];
  } catch (e) {
    console.error(e);
  }
}
