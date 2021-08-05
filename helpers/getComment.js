import { queryClient } from "gitopiajs";

export default async function getComment(commentId) {
  try {
    const qc = await queryClient();
    const res = await qc.queryComment(commentId);
    if (res.ok) {
      let c = res.data.Comment;
      // try {
      //   const owner = JSON.parse(r.owner);
      //   r.owner = owner;
      // } catch (e) {
      //   console.error(e);
      // }
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
