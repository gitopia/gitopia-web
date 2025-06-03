export default async function getAllRepositoryTag(
  apiClient,
  id,
  repositoryName
) {
  if (!repositoryName || !id) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repositoryTagAll(
      id,
      repositoryName
    );
    return res.Tag;
  } catch (e) {
    console.error(e);
  }
}
