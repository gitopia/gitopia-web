import { useApiClient } from "../context/ApiClientContext";

export default async function getUserRepositoryAll(userId) {
  if (!userId) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryUser(userId);
    if (res.status === 200) {
      return res.data.User.repositories;
    }
  } catch (e) {
    console.error(e);
  }
}
