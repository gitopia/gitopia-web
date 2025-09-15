import isNumber from "lodash/isNumber";
const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getPullDiffStats(
  storageApiUrl,
  baseRepoId = null,
  headRepoId = null,
  baseCommitSha = null,
  headCommitSha = null,
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
  const baseUrl = storageApiUrl + "/pull/diff";
  let params = {
    base_repository_id: baseRepoIdNum,
    head_repository_id: headRepoIdNum,
    base_commit_sha: baseCommitSha,
    head_commit_sha: headCommitSha,
    only_stat: true,
  };
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
