const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getPullRequestCommits(
  baseRepoId = null,
  headRepoId = null,
  baseBranch = null,
  headBranch = null,
  baseCommitSha = null,
  headCommitSha = null
) {
  let obj = {};

  // invalid sha and branch
  if (
    (!validSha.test(baseCommitSha) || !validSha.test(headCommitSha)) &&
    (!baseBranch || !headBranch)
  ) {
    return obj;
  }

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/pull/commits"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/commits";
  let params = {
    base_repository_id: Number(baseRepoId),
    head_repository_id: Number(headRepoId),
    base_branch: baseBranch,
    head_branch: headBranch,
  };

  if (validSha.test(baseCommitSha) && validSha.test(headCommitSha)) {
    params.base_commit_sha = baseCommitSha;
    params.head_commit_sha = headCommitSha;
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
