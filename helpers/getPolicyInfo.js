export default async function getPolicyInfo(
  cosmosGroupApiClient,
  groupPolicyAddress
) {
  if (!groupPolicyAddress) return null;
  try {
    const response = await cosmosGroupApiClient.queryGroupPolicyInfo(
      groupPolicyAddress
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching group policy info:", error);
  }
  return null;
}
