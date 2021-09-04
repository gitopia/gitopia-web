export default function getBranchSha(branches = [], branchName) {
  let sha;
  branches.every((b) => {
    let bName = b.name.replace("refs/heads/", "");
    if (bName === branchName) {
      sha = b.sha;
      return false;
    }
    return true;
  });
  return sha;
}
