import api from "./getApi";

export default async function getDaoAll() {
  try {
    const res = await api.queryDaoAll();
    if (res.status === 200) {
      let u = res.data.dao;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
