export default async function getUser(apiClient, userId) {
  if (!userId) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.user({ id: userId });
    return res.User;
  } catch (e) {
    console.log("Not found User", userId);
  }
}
