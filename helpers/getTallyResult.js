export default async function getTallyResult(cosmosGroupApiClient, proposalId) {
  if (!proposalId) return null;
  try {
    const res = await cosmosGroupApiClient.queryTallyResult(proposalId);
    if (res.status === 200) {
      let m = res.data.tally;
      return m;
    } else return [];
  } catch (e) {
    console.error(e);
  }
}
