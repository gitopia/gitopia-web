import { queryClient } from "gitopiajs";

export default async function getRepositoryRelease(id, repoName, tagName) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepositoryRelease(id, repoName, tagName);
    if (res.ok) {
      return res.data.Release;
    }
  } catch (e) {
    console.error(e);
  }
}
