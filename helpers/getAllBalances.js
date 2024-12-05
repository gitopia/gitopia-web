export default async function getBalances(cosmosBankApiClient, address) {
  if (!address) return null;
  try {
    const res = await cosmosBankApiClient.queryAllBalances(address);
    if (res.status === 200) {
      let u = res.data;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
