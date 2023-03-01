import api from "./getApi";

export default async function getGitServerAuthStatus(userAddress) {
  if (!userAddress) return null;
  try {
    const res = await api.queryCheckGitServerAuthorization(
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
