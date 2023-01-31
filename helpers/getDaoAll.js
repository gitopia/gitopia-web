import api from "./getApi";

export default async function getDaoAll() {
  try {
    const res = await api.queryDaoAll();
    if (res.ok) {
      let u = res.data.dao;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
