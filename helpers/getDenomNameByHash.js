export default async function getDenomNameByHash(apiClient, denom) {
  if (!denom) return null;
  try {
    const denomHash = denom.slice(4, denom.length);
    const result = await apiClient.ibc.applications.transfer.v1.denomTrace({
      hash: denomHash,
    });
    return result.denom_trace.base_denom;
  } catch (e) {
    console.error(e);
  }
}
