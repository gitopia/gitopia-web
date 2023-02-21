import api from "./getApi";

export default async function getRepositoryAll() {
  try {
    const res = await api.queryRepositoryAll();
    if (res.status === 200) {
      let u = res.data.Repository;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
