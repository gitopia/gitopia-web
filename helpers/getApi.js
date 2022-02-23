import { Api } from "@gitopia/gitopia-js/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export default api;
