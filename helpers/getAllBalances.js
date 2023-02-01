import { Api } from "../store/cosmos.bank.v1beta1/module/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

export default async function getBalances(address) {
  if (!address) return null;
  try {
    const res = await api.queryAllBalances(address);
    if (res.ok) {
      let u = res.data;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
