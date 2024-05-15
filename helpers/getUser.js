import { useApiClient } from "../context/ApiClientContext";

export default async function getUser(userId) {
  if (!userId) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryUser(userId);
    if (res.status === 200) {
      let u = res.data.User;
      return u;
    }
  } catch (e) {
    console.log("Not found User", userId);
  }
}
