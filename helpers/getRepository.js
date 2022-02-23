import api from "./getApi";

export default async function getUser(repoId) {
  try {
    const res = await api.queryRepository(repoId);
    if (res.ok) {
      let u = res.data.Repository;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
