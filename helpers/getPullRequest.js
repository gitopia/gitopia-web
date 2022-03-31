import api from "./getApi";

export default async function getPullRequest(pullId) {
  try {
    const res = await api.queryPullRequest(pullId);
    if (res.ok) {
      let i = res.data.PullRequest;
      // try {
      //   const owner = JSON.parse(r.owner);
      //   r.owner = owner;
      // } catch (e) {
      //   console.error(e);
      // }
      return i;
    }
  } catch (e) {
    console.error(e);
  }
}
