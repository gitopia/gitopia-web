export default async function getRepositoryIssueAll(
  apiClient,
  id,
  repositoryName,
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
    // TODO: check option and pagination
    const res = await apiClient.queryRepositoryIssueAll(
      id,
      repositoryName,
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
