export default async function getTallyResult(apiClient, proposalId) {
  if (!proposalId) return null;
  try {
    const res = await apiClient.cosmos.group.v1.tallyResult({ proposalId });
    return res.tally;
  } catch (e) {
    console.error(e);
  }
}
