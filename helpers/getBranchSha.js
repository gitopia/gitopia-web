export default function getBranchSha(branchName, branches = [], tags = []) {
  let sha;
  branches.every((b) => {
    if (b.name === branchName) {
      sha = b.sha;
      return false;
    }
    return true;
  });
  tags.every((t) => {
    if (t.name === branchName) {
      sha = t.sha;
      // TODO: handle tag pointer
      return false;
    }
    return true;
  });
  return sha;
}
