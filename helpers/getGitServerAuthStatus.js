import { Api } from "../store/cosmos.authz.v1beta1/module/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

export async function getGitServerAuthStatusForRepoFork(userAddress) {
  try {
    const query = {
      granter: userAddress,
      grantee: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
      msgTypeUrl: "/gitopia.gitopia.gitopia.MsgForkRepository",
    };
    const res = await api.queryGrants(query);
    if (res.ok) {
      console.log(res.data);
      return true;
    }
  } catch (e) {
    // console.error(e);
    return null;
  }
}

export async function getGitServerAuthStatusForPullState(userAddress) {
  try {
    const query = {
      granter: userAddress,
      grantee: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
      msgTypeUrl: "/gitopia.gitopia.gitopia.MsgSetPullRequestState",
    };
    const res = await api.queryGrants(query);
    if (res.ok) {
      console.log(res.data);
      return {};
    }
  } catch (e) {
    console.error(e);
  }
}
