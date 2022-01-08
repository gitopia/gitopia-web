import api from "./getApi";

export default async function getUserRepositoryAll(userId) {
  if (!userId) return null;
  try {
    const res = await api.queryUser(userId);
    if (res.ok) {
      return res.data.User.repositories;
    }
  } catch (e) {
    console.error(e);
  }
}
