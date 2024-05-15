import { useApiClient } from "../context/ApiClientContext";

export default async function getPullAll() {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryPullRequestAll();
    if (res.status === 200) {
      let u = res.data.PullRequest;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
