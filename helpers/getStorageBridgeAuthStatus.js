export default async function getStorageBridgeAuthStatus(
  apiClient,
  userAddress
) {
  if (!userAddress) return null;
  try {
    const res =
      await apiClient.gitopia.gitopia.gitopia.checkStorageProviderAuthorization(
        {
          userAddress,
          providerAddress:
            process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS,
        }
      );
    if (res.haveAuthorization) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
