import api from "./getApi";

export default async function getPullRequestMergePermission(
  userAddress,
  repositoryId,
  pullIid
) {
  try {
    const res = await api.queryPullRequestMergePermission(
      userAddress,
      repositoryId,
      pullIid
    );
    if (res.ok) {
      return res.data;
    }
  } catch (e) {
    console.error(e);
  }
}
