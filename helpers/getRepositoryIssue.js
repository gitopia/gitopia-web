import { queryClient } from "gitopiajs";

export default async function getRepositoryIssue(userId, repoName, issueIid) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepositoryIssue(userId, repoName, issueIid);
    if (res.ok) {
      return res.data.Issue;
    }
  } catch (e) {
    console.error(e);
  }
}
