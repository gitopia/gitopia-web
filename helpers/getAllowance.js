import { Api } from "../store/cosmos.feegrant.v1beta1/rest";
const api = new Api({ baseURL: process.env.NEXT_PUBLIC_API_URL });

export default async function getAllowance(address) {
  if (!address) return null;
  try {
    const res = await api.queryAllowance(process.env.NEXT_PUBLIC_FEE_GRANTER, address);
    if (res.status === 200) {
      return res.data?.allowance;
    }
  } catch (e) {
    console.error(e);
  }
}
