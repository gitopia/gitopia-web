import { queryClient } from "gitopiajs";

export default async function getRepositoryPullAll(id, repoName) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepositoryPullRequestAll(id, repoName);
    if (res.ok) {
      return res.data.PullRequest;
    }
  } catch (e) {
    console.error(e);
  }
}
