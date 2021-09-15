import { queryClient } from "gitopiajs";

export default async function getUser(repoId) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryRepository(repoId);
    if (res.ok) {
      let u = res.data.Repository;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
