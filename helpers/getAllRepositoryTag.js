export default async function getAllRepositoryTag(
  apiClient,
  id,
  repositoryName
) {
  if (!repositoryName || !id) return null;
  try {
    const res = await apiClient.queryRepositoryTagAll(id, repositoryName);
    if (res.status === 200) {
      let t = res.data.Tag;
      return t;
    }
  } catch (e) {
    console.error(e);
  }
}
