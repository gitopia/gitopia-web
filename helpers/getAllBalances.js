import { Api } from "../store/cosmos.bank.v1beta1/module/rest";

export default async function getBalances(apiNode, address) {
  if (!address) return null;
  try {
    const api = new Api({ baseUrl: apiNode });
    const res = await api.queryAllBalances(address);
    if (res.status === 200) {
      let u = res.data;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
