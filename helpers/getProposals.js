export default async function getProposals(cosmosGovApiClient) {
  try {
    const res = await cosmosGovApiClient.queryProposals();
    if (res.status === 200) {
      let u = res.data.proposals;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
