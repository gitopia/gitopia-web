const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getPullDiff(
  baseRepoId = null,
  headRepoId = null,
  baseCommitSha = null,
  headCommitSha = null,
  nextKey = null,
  onlyStat
) {
  let obj = {};
  if (!validSha.test(baseCommitSha) || !validSha.test(headCommitSha)) {
    return obj;
  }
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/pull/diff"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/diff";
  let params = {
    base_repository_id: Number(baseRepoId),
    head_repository_id: Number(headRepoId),
    base_commit_sha: baseCommitSha,
    head_commit_sha: headCommitSha,
    pagination: {
      limit: 10,
    },
  };
  if (onlyStat) {
    params.only_stat = true;
  }
  if (nextKey) {
    params.pagination.key = nextKey;
  }
  console.log("params", params);
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
