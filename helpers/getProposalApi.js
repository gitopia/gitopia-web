import { Api } from "../store/cosmos.gov.v1beta1/module/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export default api;
