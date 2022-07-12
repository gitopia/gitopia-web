import api from "./getApi";

export default async function getRepositoryAll() {
  try {
    const res = await api.queryRepositoryAll();
    if (res.ok) {
      let u = res.data.Repository;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
