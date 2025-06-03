export default async function getDao(apiClient, daoId) {
  if (!daoId) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.dao({ id: daoId });
    return res.dao;
  } catch (e) {
    console.log("Not found DAO", daoId);
    // console.error(e);
  }
}
