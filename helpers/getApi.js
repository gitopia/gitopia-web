import { Api } from "@gitopia/gitopia-js/dist/rest";
const api = new Api({ baseURL: process.env.NEXT_PUBLIC_API_URL });
export default api;
