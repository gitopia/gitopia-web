import api from "./getApi";

export default async function getOrganizationAll() {
  try {
    const res = await api.queryOrganizationAll();
    if (res.ok) {
      let u = res.data.Organization;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
