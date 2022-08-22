import api from "./getApi";

export default async function getAllRepositoryTag(id, repositoryName) {
  if (!repositoryName || !id) return null;
  try {
    const res = await api.queryRepositoryTagAll(id, repositoryName);
    if (res.ok) {
      let t = res.data.Tag;
      return t;
    }
  } catch (e) {
    console.error(e);
  }
}
