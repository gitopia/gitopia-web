export default async function getBalances(apiClient, address) {
  if (!address) return null;
  try {
    const res = await apiClient.cosmos.bank.v1beta1.allBalances({ address });
    return res;
  } catch (e) {
    console.error(e);
  }
}
