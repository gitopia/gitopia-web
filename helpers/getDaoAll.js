import { useApiClient } from "../context/ApiClientContext";

export default async function getDaoAll() {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryDaoAll();
    if (res.status === 200) {
      let u = res.data.dao;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
