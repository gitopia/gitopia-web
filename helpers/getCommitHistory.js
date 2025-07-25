import axios from "../helpers/axiosFetch";

const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getCommitHistory(
  storageApiUrl,
  repoId = null,
  initCommitSha = null,
  path = null,
  limit = 100,
  nextKey = null,
  shouldGetTotalCount = true
) {
  let obj = {};
  if (!validSha.test(initCommitSha)) {
    return obj;
  }
  let baseUrl = storageApiUrl + "/commits";
  let params = {
    repository_id: Number(repoId),
    init_commit_id: initCommitSha,
    pagination: {
      count_total: shouldGetTotalCount,
      limit: limit,
    },
  };
  if (path) {
    params.path = path;
  }
  if (nextKey) {
    params.pagination.key = nextKey;
  }

  await axios
    .post(baseUrl, params, {})
    .then((response) => {
      obj = response.data;
    })
    .catch((err) => console.log(err));

  return obj;
}
