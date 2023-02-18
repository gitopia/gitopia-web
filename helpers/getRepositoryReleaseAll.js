import api from "./getApi";

export default async function getRepositoryReleaseAll(id, repoName) {
  try {
    const res = await api.queryRepositoryReleaseAll(id, repoName);
    if (res.status === 200) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
