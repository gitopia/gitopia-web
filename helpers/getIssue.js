import api from "./getApi";

export default async function getIssue(issueId) {
  try {
    const res = await api.queryIssue(issueId);
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
