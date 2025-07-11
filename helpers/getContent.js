const validSha = new RegExp(/^[a-f0-9]{40}$/);
import axios from "../helpers/axiosFetch";

export default async function getContent(
  storageApiUrl,
  repoId = null,
  commitSha = null,
  path = null,
  nextKey = null,
  limit = 100,
  noRestriction = false
) {
  let obj = {};
  if (!validSha.test(commitSha)) {
    return obj;
  }
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/content"
      : storageApiUrl + "/content";
  let params = {
    repository_id: Number(repoId),
    ref_id: commitSha,
    include_last_commit: true,
    pagination: {
      limit: limit,
    },
  };
  if (nextKey) {
    params.pagination.key = nextKey;
  }
  if (path) {
    params.path = path;
  }
  if (noRestriction) {
    params.no_restriction = true;
  }
  await axios
    .post(baseUrl, params, {})
    .then((response) => {
      obj = response.data;
    })
    .catch((err) => console.log(err));

  return obj;
}
