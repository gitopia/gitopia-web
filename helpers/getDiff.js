import isNumber from "lodash/isNumber";
const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getDiff(
  repoId = null,
  commitSha = null,
  nextKey = null,
  prevCommitSha,
  onlyStat,
  limit = 10
) {
  let obj = {},
    numRepoId = Number(repoId);
  if (!validSha.test(commitSha)) {
    return obj;
  }
  if (!isNumber(numRepoId)) {
    return obj;
  }
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/diff"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/diff";
  let params = {
    repository_id: numRepoId,
    commit_sha: commitSha,
  };

  if (limit !== null) {
    params.pagination = {
      limit: limit,
    };
  }

  if (prevCommitSha) {
    if (!validSha.test(prevCommitSha)) {
      return obj;
    }
    params.previous_commit_sha = prevCommitSha;
  }
  if (onlyStat) {
    params.only_stat = true;
  } else {
    params.only_stat = false;
  }
  if (nextKey) {
    params.pagination.key = nextKey;
  }
  await fetch(baseUrl, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    body: JSON.stringify(params),
  })
    .then((response) => {
      obj = response.json();
    })
    .catch((err) => console.error(err));

  return obj;
}
