import { useApiClient } from "../context/ApiClientContext";

export default async function getRepositoryAll() {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryRepositoryAll();
    if (res.status === 200) {
      let u = res.data.Repository;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
