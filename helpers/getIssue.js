import { queryClient } from "gitopiajs";

export default async function getIssue(issueId) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryIssue(issueId);
    if (res.ok) {
      let i = res.data.Issue;
      // try {
      //   const owner = JSON.parse(r.owner);
      //   r.owner = owner;
      // } catch (e) {
      //   console.error(e);
      // }
      return i;
    }
  } catch (e) {
    console.error(e);
  }
}