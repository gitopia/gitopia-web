const validSha = new RegExp(/^[a-f0-9]{40}$/);

export default async function getContent(
  repoId = null,
  commitSha = null,
  path = null,
  nextKey = null
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
    pagination: {
      limit: 100,
    },
  };
  if (nextKey) {
    params.pagination.key = nextKey;
  }
  if (path) {
    params.path = path;
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
