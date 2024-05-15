import { Api } from "../store/cosmos.feegrant.v1beta1/rest";

export default async function getAllowance(apiNode, address) {
  if (!address) return null;
  try {
    const api = new Api({ baseURL: apiNode });
    const res = await api.queryAllowance(
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
