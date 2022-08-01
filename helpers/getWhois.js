import api from "./getApi";

export default async function getWhois(id) {
  if (!id) return null;
  try {
    const res = await api.queryWhois(id);
    if (res.ok) {
      let u = res.data.Whois;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
