import api from "./getApi";

export default async function getBounty(id) {
  try {
    const res = await api.queryBounty(id);
    if (res.status === 200) {
      let b = res.data.Bounty;
      return b;
    }
  } catch (e) {
    console.error(e);
  }
}
