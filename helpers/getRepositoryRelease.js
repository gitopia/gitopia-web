import api from "./getApi";

export default async function getRepositoryRelease(id, repoName, tagName) {
  try {
    const res = await api.queryRepositoryRelease(id, repoName, tagName);
    if (res.ok) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
