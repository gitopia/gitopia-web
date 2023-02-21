import api from "./getApi";

export default async function getRepositoryReleaseLatest(id, repoName) {
  try {
    const res = await api.queryRepositoryReleaseLatest(id, repoName);
    if (res.status === 200) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
