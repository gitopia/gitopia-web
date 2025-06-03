export default async function getBounty(apiClient, id) {
  try {
    const res = await apiClient.gitopia.gitopia.gitopia.bounty(id);
    return res.Bounty;
  } catch (e) {
    console.error(e);
  }
}
