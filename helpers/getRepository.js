export default async function getRepository(apiClient, repoId) {
  if (!repoId) return null;
  try {
    const res = await apiClient.queryRepository(repoId);
    if (res.status === 200) {
      let u = res.data.Repository;
      return u;
    }
  } catch (e) {
    console.log("Not found repository", repoId);
  }
}
