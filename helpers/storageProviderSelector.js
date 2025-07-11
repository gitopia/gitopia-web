import checkLatency from "./checkLatency";

const selectStorageProvider = async (providers) => {
    try {
        if (providers.length === 0) {
            return null;
        }

        const latencies = await Promise.all(
            providers.map((p) => checkLatency(p.apiUrl))
        );
        const lowestLatencyIndex = latencies.indexOf(Math.min(...latencies));
        return providers[lowestLatencyIndex];
    } catch (error) {
        console.error("Failed to select storage provider:", error);
        return null;
    }
}

export default selectStorageProvider;

export const getSavedStorageProvider = () => {
  const providerInfo = localStorage.getItem("storageProviderInfo");
  if (providerInfo) {
    return JSON.parse(providerInfo);
  }
  return null;
};
