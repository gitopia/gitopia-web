import { useApiClient } from "../context/ApiClientContext";

export default async function getDaoMember(daoId) {
  if (!daoId) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryDaoMemberAll(daoId);
    if (res.status === 200) {
      let m = res.data.Member;
      return m;
    } else return [];
  } catch (e) {
    console.error(e);
  }
}
