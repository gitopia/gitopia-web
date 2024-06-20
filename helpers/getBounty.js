export default async function getBounty(apiClient, id) {
  try {
    const res = await apiClient.queryBounty(id);
    if (res.status === 200) {
      let b = res.data.Bounty;
      return b;
    }
  } catch (e) {
    console.error(e);
  }
}
