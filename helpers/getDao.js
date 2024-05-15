import { useApiClient } from "../context/ApiClientContext";

export default async function getDao(daoId) {
  if (!daoId) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryDao(daoId);
    if (res.status === 200) {
      let u = res.data.dao;
      return u;
    }
  } catch (e) {
    console.log("Not found DAO", daoId);
    // console.error(e);
  }
}
