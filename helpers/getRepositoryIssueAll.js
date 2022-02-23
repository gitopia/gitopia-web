import api from "./getApi";

export default async function getRepositoryIssueAll(
  id,
  repoName,
  option,
  pagination
) {
  try {
    const query = {};
    for (let o in option) {
      query[`option.${o}`] = option[o];
    }
    for (let p in pagination) {
      query[`pagination.${p}`] = pagination[p];
    }
    console.log(query);
    const res = await api.queryRepositoryIssueAll(id, repoName, query);
    if (res.ok) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
  }
}
