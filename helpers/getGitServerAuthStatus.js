export default async function getGitServerAuthStatus(apiClient, userAddress) {
  if (!userAddress) return null;
  try {
    const res =
      await apiClient.gitopia.gitopia.gitopia.checkGitServerAuthorization({
        userAddress,
        providerAddress: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
      });
    if (res.haveAuthorization) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
