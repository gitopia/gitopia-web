import api from "./getApi";

export default async function getBounties() {
  try {
    const res = await api.queryBountyAll();
    if (res.ok) {
      let b = res.data.Bounty;
      return b;
    }
  } catch (e) {
    console.error(e);
  }
}
