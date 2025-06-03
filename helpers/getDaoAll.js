import { useApiClient } from "../context/ApiClientContext";

export default async function getDaoAll() {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.gitopia.gitopia.gitopia.daoAll({});
    return res.dao;
  } catch (e) {
    console.error(e);
  }
}
