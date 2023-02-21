import api from "./getApi";

export default async function getRepositoryById(repositoryId) {
  if (!repositoryId) return null;
  try {
    const res = await api.queryRepository(repositoryId);
    if (res.status === 200) {
      return res.data.Repository;
    }
  } catch (e) {
    console.error(e);
  }
}
