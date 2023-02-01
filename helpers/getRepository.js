import api from "./getApi";

export default async function getRepository(repoId) {
  if (!repoId) return null;
  try {
    const res = await api.queryRepository(repoId);
    if (res.ok) {
      let u = res.data.Repository;
      return u;
    }
  } catch (e) {
    console.log("Not found repository", repoId);
  }
}
