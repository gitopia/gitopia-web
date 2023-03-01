import api from "./getApi";

export default async function getWhois(id) {
  if (!id) return null;
  let lId = String(id).toLowerCase();
  try {
    const res = await api.queryWhois(lId);
    if (res.status === 200) {
      let u = res.data.Whois;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
