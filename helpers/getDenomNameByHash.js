export default async function getDenomNameByHash(
  ibcAppTransferApiClient,
  denom
) {
  if (!denom) return null;
  try {
    const denomHash = denom.slice(4, denom.length);
    const result = await ibcAppTransferApiClient.queryDenomTrace(denomHash);
    if (result.ok) {
      let denom = result.data.denom_trace.base_denom;
      return denom;
    }
  } catch (e) {
    console.error(e);
  }
}
