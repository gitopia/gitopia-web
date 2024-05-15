import { useApiClient } from "../context/ApiClientContext";

export default async function getRepositoryPullAll(
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
    const { apiClient } = useApiClient();
    const res = await apiClient.queryRepositoryPullRequestAll(
      id,
      repoName,
      query
    );
    if (res.status === 200) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
  }
}
