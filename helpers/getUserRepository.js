import { txClient, queryClient } from "gitopiajs";

export default async function getUserRepository(userId, repositoryName) {
  if (!userId || !repositoryName) return null;
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryUserRepository(userId, repositoryName);
    if (res.ok) {
      let r = res.data.Repository;
      try {
        const owner = JSON.parse(r.owner);
        r.owner = owner;
      } catch (e) {
        console.error(e);
      }
      console.log(r);
      return r;
    }
    return {
      id: "",
      name: "",
      owner: { ID: "" },
    };
  } catch (e) {
    console.error(e);
  }
}