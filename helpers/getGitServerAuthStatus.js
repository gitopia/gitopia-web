export default async function getGitServerAuthStatus(apiClient, userAddress) {
  if (!userAddress) return null;
  try {
    const res = await apiClient.queryCheckGitServerAuthorization(
      userAddress,
      process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS
    );
    if (res.status === 200 && res.data.haveAuthorization) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
