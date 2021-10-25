import { queryClient } from "gitopiajs";

export default async function getRepositoryReleaseAll(id, repoName) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepositoryReleaseAll(id, repoName);
    if (res.ok) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
