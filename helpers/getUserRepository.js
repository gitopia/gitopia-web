import { txClient, queryClient } from "gitopiajs";

export default async function getUserRepository(userId, repositoryName) {
  if (!userId || !repositoryName) return null;
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryAddressRepository(userId, repositoryName);
    if (res.ok) {
      return res.data.Repository;
    }
    return {
      id: "",
      name: "",
      owner: { id: "" },
    };
  } catch (e) {
    console.error(e);
  }
}
