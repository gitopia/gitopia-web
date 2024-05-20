export default async function getAllRepositoryBranch(
  apiClient,
  id,
  repositoryName
) {
  if (!repositoryName || !id) return null;
  try {
    const res = await apiClient.queryRepositoryBranchAll(id, repositoryName);
    if (res.status === 200) {
      let b = res.data.Branch;
      return b;
    }
  } catch (e) {
    console.error(e);
  }
}
