export default async function getIssue(
  apiClient,
  id,
  repositoryName,
  issueIid
) {
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.repositoryIssue({
      id,
      repositoryName,
      issueIid,
    });
    return res.Issue;
  } catch (e) {
    console.error(e);
  }
}
