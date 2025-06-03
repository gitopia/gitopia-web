export default async function getAllowance(apiClient, address) {
  if (!address) return null;
  try {
    const res = await apiClient.cosmos.feegrant.v1beta1.allowance({
      granter: process.env.NEXT_PUBLIC_FEE_GRANTER,
      grantee: address,
    });
    return res.allowance;
  } catch (e) {
    console.error(e);
  }
}
