import api from "./getApi";

export default async function getAnyRepositoryAll(usernameOrAddress) {
  if (!usernameOrAddress) return null;
  try {
    const res = await api.queryAnyRepositoryAll(usernameOrAddress);
    if (res.ok) {
      return res.data.Repository;
    }
    return [];
  } catch (e) {
    console.error(e);
  }
}