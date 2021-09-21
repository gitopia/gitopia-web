import { queryClient } from "gitopiajs";

export default async function getOrganization(orgId) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const res = await qc.queryOrganization(orgId);
    if (res.ok) {
      let u = res.data.Organization;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
