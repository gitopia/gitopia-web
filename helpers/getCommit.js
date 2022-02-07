const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getCommit(
  repoId = null,
  commitSha = null,
  nextKey = null
) {
  let obj = {};
  if (!validSha.test(commitSha)) {
    return obj;
  }
  let baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/commits"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/commits";
  let params = {
    repository_id: Number(repoId),
    pagination: {
      limit: 100,
    },
  };
  if (nextKey) {
    params.pagination.key = nextKey;
  }
  if (commitSha) {
    baseUrl = baseUrl + "/" + commitSha;
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
