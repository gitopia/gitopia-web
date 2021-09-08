import { queryClient } from "gitopiajs";

export default async function getRepositoryIssue(id, repoName, issueIid) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepositoryIssue(id, repoName, issueIid);
    if (res.ok) {
      return res.data.Issue;
    }
  } catch (e) {
    console.error(e);
  }
}
