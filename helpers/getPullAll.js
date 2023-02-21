import api from "./getApi";

export default async function getPullAll() {
  try {
    const res = await api.queryPullRequestAll();
    if (res.status === 200) {
      let u = res.data.PullRequest;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
