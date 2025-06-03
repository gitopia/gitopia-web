export default async function getUserDaoAll(apiClient, usernameOrAddress) {
  if (!usernameOrAddress) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.userDaoAll({
      userId: usernameOrAddress,
    });
    return res.dao;
  } catch (e) {
    console.error(e);
  }
}
