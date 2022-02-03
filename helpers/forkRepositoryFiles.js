export default async function forkRepositoryFiles(sourceRepoId, targetRepoId) {
  if (!sourceRepoId || !targetRepoId) return;
  const baseUrl = process.env.NEXT_PUBLIC_OBJECTS_URL + "/fork";
  let obj = {};
  let params = {
    source_repository_id: Number(sourceRepoId),
    target_repository_id: Number(targetRepoId),
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
