import { useApiClient } from "../context/ApiClientContext";

export default async function getAnyRepository(
  usernameOrAddress,
  repositoryName
) {
  if (!usernameOrAddress || !repositoryName) return null;
  try {
    const { apiClient } = useApiClient();
    const res = await apiClient.queryAnyRepository(
      usernameOrAddress,
      repositoryName
    );
    if (res.status === 200) {
      return res.data.Repository;
    }
    return {
      id: "",
      name: "",
      owner: { id: "" },
    };
  } catch (e) {
    console.error(e);
  }
}
