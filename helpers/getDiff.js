import isNumber from "lodash/isNumber";
const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getDiff(
  storageApiUrl,
  repoId = null,
  commitSha = null,
  prevCommitSha = null,
  offset = 0,
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
  const baseUrl = storageApiUrl + "/diff";
  let params = {
    repository_id: numRepoId,
    commit_sha: commitSha,
    pagination: {
      offset,
      limit,
    },
  };

  if (prevCommitSha) {
    if (!validSha.test(prevCommitSha)) {
      return obj;
    }
    params.previous_commit_sha = prevCommitSha;
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
