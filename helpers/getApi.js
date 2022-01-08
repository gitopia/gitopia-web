import { Api } from "gitopiajs/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export default api;
