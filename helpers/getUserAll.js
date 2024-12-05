import { useApiClient } from "../context/ApiClientContext";

export default async function getUserAll() {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryUserAll();
    if (res.status === 200) {
      let u = res.data.User;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
