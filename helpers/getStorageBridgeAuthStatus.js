import { useApiClient } from "../context/ApiClientContext";

export default async function getStorageBridgeAuthStatus(
  apiClient,
  userAddress
) {
  if (!userAddress) return null;
  try {
    const res = await apiClient.queryCheckStorageProviderAuthorization(
      userAddress,
      process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS
    );
    if (res.status === 200 && res.data.haveAuthorization) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
