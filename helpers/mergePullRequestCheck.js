export default async function mergePullRequestCheck(
  pullReqIid,
  baseRepoId,
  headRepoId,
  baseBranch,
  headBranch,
  mergeStyle,
  userName,
  userEmail,
  sender
) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/api/pull/check"
      : process.env.NEXT_PUBLIC_OBJECTS_URL + "/pull/check";
  let obj = {};
  let params = {
    base_repository_id: Number(baseRepoId),
    head_repository_id: Number(headRepoId),
    base_branch: baseBranch,
    head_branch: headBranch,
    merge_style: mergeStyle,
    user_name: userName,
    user_email: userEmail,
    sender: sender,
    pull_request_iid: Number(pullReqIid),
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
