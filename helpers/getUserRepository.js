import api from "./getApi";

export default async function getUserRepository(userId, repositoryName) {
  if (!userId || !repositoryName) return null;
  try {
    const res = await api.queryAddressRepository(userId, repositoryName);
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
