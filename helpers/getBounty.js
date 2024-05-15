import { useApiClient } from "../context/ApiClientContext";

export default async function getBounty(id) {
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryBounty(id);
    if (res.status === 200) {
      let b = res.data.Bounty;
      return b;
    }
  } catch (e) {
    console.error(e);
  }
}
