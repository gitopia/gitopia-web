import api from "./getApi";

export default async function getAnyRepository(
  usernameOrAddress,
  repositoryName
) {
  if (!usernameOrAddress || !repositoryName) return null;
  try {
    const res = await api.queryAnyRepository(usernameOrAddress, repositoryName);
    if (res.ok) {
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
