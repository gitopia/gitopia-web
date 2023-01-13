import api from "./getApi";

export default async function getDao(daoId) {
  if (!daoId) return null;
  try {
    const res = await api.queryDao(daoId);
    if (res.ok) {
      let u = res.data.dao;
      return u;
    }
  } catch (e) {
    console.log("Not found DAO", daoId);
    // console.error(e);
  }
}
