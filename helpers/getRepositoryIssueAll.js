import { queryClient } from "gitopiajs";

export default async function getRepositoryIssueAll(userId, repoName) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepositoryIssueAll(userId, repoName);
    if (res.ok) {
      return res.data.Issue;
    }
  } catch (e) {
    console.error(e);
  }
}
