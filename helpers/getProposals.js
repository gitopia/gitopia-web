export default async function getProposals(apiClient) {
  try {
    const res = await apiClient.cosmos.gov.v1beta1.proposals({});
    return res.proposals;
  } catch (e) {
    console.error(e);
  }
}
