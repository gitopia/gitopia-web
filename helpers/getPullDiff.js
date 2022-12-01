import isNumber from "lodash/isNumber";
const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getPullDiff(
  baseRepoId = null,
  headRepoId = null,
  baseCommitSha = null,
  headCommitSha = null,
  nextKey = null,
  onlyStat
) {
  let obj = {},
    baseRepoIdNum = Number(baseRepoId),
    headRepoIdNum = Number(headRepoId);
  if (!validSha.test(baseCommitSha) || !validSha.test(headCommitSha)) {
    return obj;
  }
  if (!isNumber(baseRepoIdNum) || !isNumber(headRepoIdNum)) {
    return obj;
  }
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/pull/diff"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/diff";
  let params = {
    base_repository_id: baseRepoIdNum,
    head_repository_id: headRepoIdNum,
    base_commit_sha: baseCommitSha,
    head_commit_sha: headCommitSha,
    pagination: {
      limit: 10,
    },
  };
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
