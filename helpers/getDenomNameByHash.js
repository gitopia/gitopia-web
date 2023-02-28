import { Api } from "../store/ibc.applications.transfer.v1/module/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export default async function getDenomNameByHash(denom) {
  if (!denom) return null;
  try {
    const denomHash = denom.slice(4, denom.length);
    const result = await api.queryDenomTrace(denomHash);
    if (result.ok) {
      let denom = result.data.denom_trace.base_denom;
      return denom;
    }
  } catch (e) {
    console.error(e);
  }
}
