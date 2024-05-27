export default async function getAllowance(cosmosFeegrantApiClient, address) {
  if (!address) return null;
  try {
    const res = await cosmosFeegrantApiClient.queryAllowance(
      process.env.NEXT_PUBLIC_FEE_GRANTER,
      address
    );
    if (res.status === 200) {
      return res.data?.allowance;
    }
  } catch (e) {
    console.error(e);
  }
}
