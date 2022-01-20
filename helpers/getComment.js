import api from "./getApi";

export default async function getComment(commentId) {
  try {
    const res = await api.queryComment(commentId);
    if (res.ok) {
      let c = res.data.Comment;
      return c;
    }
  } catch (e) {
    console.error(e);
  }
}
