export default async function getAllRepositoryBranch(
  apiClient,
  id,
  repositoryName
) {
  if (!repositoryName || !id) return null;
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repositoryBranchAll({
      id,
      repositoryName,
    });
    return res.Branch;
  } catch (e) {
    console.error(e);
  }
}
