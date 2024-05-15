import { useApiClient } from "../context/ApiClientContext";

export default async function getUserDaoAll(usernameOrAddress) {
  if (!usernameOrAddress) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryUserDaoAll(usernameOrAddress);
    if (res.status === 200) {
      return res.data.dao;
    }
    return [];
  } catch (e) {
    console.error(e);
  }
}
