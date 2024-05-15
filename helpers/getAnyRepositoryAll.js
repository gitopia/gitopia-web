import { useApiClient } from "../context/ApiClientContext";

export default async function getAnyRepositoryAll(usernameOrAddress) {
  if (!usernameOrAddress) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryAnyRepositoryAll(usernameOrAddress);
    if (res.status === 200) {
      return res.data.Repository;
    }
    return [];
  } catch (e) {
    console.error(e);
  }
}
