import { useApiClient } from "../context/ApiClientContext";

export default async function getRepositoryRelease(id, repoName, tagName) {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryRepositoryRelease(id, repoName, tagName);
    if (res.status === 200) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
