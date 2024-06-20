import { useApiClient } from "../context/ApiClientContext";

export default async function getRepositoryReleaseLatest(id, repoName) {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryRepositoryReleaseLatest(id, repoName);
    if (res.status === 200) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
