import { txClient, queryClient } from "gitopiajs";

export default async function getOrganizationRepositoryAll(orgId) {
  if (!orgId) return null;
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    // TODO: use queryOrganizationRepositoryAll
    const res = await qc.queryOrganization(orgId);
    if (res.ok) {
      return res.data.Organization.repositories;
    }
  } catch (e) {
    console.error(e);
  }
}
