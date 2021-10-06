import { queryClient } from "gitopiajs";

export default async function getRepositoryPullRequest(id, repoName, pullIid) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepositoryPullRequest(id, repoName, pullIid);
    if (res.ok) {
      return res.data.PullRequest;
    }
  } catch (e) {
    console.error(e);
  }
}
