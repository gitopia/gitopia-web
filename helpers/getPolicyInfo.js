export default async function getPolicyInfo(apiClient, groupPolicyAddress) {
  if (!groupPolicyAddress) return null;
  try {
    const response = await apiClient.cosmos.group.v1.groupPolicyInfo({
      address: groupPolicyAddress,
    });
    return response;
  } catch (error) {
    console.error("Error fetching group policy info:", error);
  }
  return null;
}
