const validSha = new RegExp(/^[a-f0-9]{40}$/);
import axios from "axios";

export default async function getContent(
  repoId = null,
  commitSha = null,
  path = null,
  nextKey = null,
  limit = 100
) {
  let obj = {};
  if (!validSha.test(commitSha)) {
    return obj;
  }
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/content"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/content";
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
  console.log("params", params);
  await axios
    .post(baseUrl, params, {})
    .then((response) => {
      obj = response.data;
    })
    .catch((err) => console.log(err));

  return obj;
}