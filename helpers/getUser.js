import { queryClient } from "gitopiajs";

export default async function getUser(userId) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryUser(userId);
    if (res.ok) {
      let u = res.data.User;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
