export default async function getDiff(repoId, commitSha1, commitSha2) {
  let obj = "";
  const baseUrl = "/api/diff";

  await fetch(baseUrl + "/" + repoId + "/" + commitSha1 + "/" + commitSha2, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  })
    .then((response) => {
      obj = response.text();
    })
    .catch((err) => console.error(err));

  console.log(obj);
  return obj;
}
