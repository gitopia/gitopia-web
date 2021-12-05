export default async function getPullRequestCommits(
  baseRepoId = null,
  headRepoId = null,
  baseBranch = null,
  headBranch = null
) {
  let obj = {};
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/pull/commits"
      : proces.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/commits";
  let params = {
    base_repository_id: Number(baseRepoId),
    head_repository_id: Number(headRepoId),
    base_branch: baseBranch,
    head_branch: headBranch,
  };
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
