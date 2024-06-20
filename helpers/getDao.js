export default async function getDao(apiClient, daoId) {
  if (!daoId) return null;
  try {
    const res = await apiClient.queryDao(daoId);
    if (res.status === 200) {
      let u = res.data.dao;
      return u;
    }
  } catch (e) {
    console.log("Not found DAO", daoId);
    // console.error(e);
  }
}
