import api from "./getApi";

export default async function getAllRepositoryBranch(id, repositoryName) {
  if (!repositoryName || !id) return null;
  try {
    const res = await api.queryRepositoryBranchAll(id, repositoryName);
    if (res.ok) {
      let b = res.data.Branch;
      return b;
    }
  } catch (e) {
    console.error(e);
  }
}
