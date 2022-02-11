import api from "./getApi";

export default async function getPullRequestMergePermission(
  userAddress,
  pullId
) {
  try {
    const res = await api.queryPullRequestMergePermission(userAddress, pullId);
    if (res.ok) {
      return res.data;
    }
  } catch (e) {
    console.error(e);
  }
}
