export default async function getWhois(apiClient, id) {
  if (!id) return null;
  let lId = String(id).toLowerCase();
  try {
    const res = await apiClient.queryWhois(lId);
    if (res.status === 200) {
      let u = res.data.Whois;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
