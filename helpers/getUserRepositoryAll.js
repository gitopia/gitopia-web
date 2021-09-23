import { txClient, queryClient } from "gitopiajs";

export default async function getUserRepositoryAll(userId) {
  if (!userId) return null;
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryUser(userId);
    if (res.ok) {
      return res.data.User.repositories;
    }
  } catch (e) {
    console.error(e);
  }
}
