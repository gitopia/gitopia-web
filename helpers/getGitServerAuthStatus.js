import api from "./getApi";

export async function getGitServerAuthorization(userAddress) {
  console.log("getGitServerAuthorization", userAddress);
  if (!userAddress) return null;
  try {
    const res = await api.queryCheckGitServerAuthorization(
      userAddress,
      process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS
    );
    console.log(res);
    if (res.ok && res.data.haveAuthorization) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    // console.error(e);
    return null;
  }
}
