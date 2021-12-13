const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getDiff(
  repoId = null,
  commitSha = null,
  nextKey = null,
  prevCommitSha,
  onlyStat
) {
  let obj = {};
  if (!validSha.test(commitSha)) {
    return obj;
  }
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/diff"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/diff";
  let params = {
    repository_id: Number(repoId),
    commit_sha: commitSha,
    pagination: {
      limit: 10,
    },
  };
  if (prevCommitSha) {
    if (!validSha.test(prevCommitSha)) {
      return obj;
    }
    params.previous_commit_sha = prevCommitSha;
  }
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
