export default async function getWhois(apiClient, id) {
  if (!id) return null;
  let lId = String(id).toLowerCase();
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.whois({ name: lId });
    return res.Whois;
  } catch (e) {
    console.error(e);
  }
}
