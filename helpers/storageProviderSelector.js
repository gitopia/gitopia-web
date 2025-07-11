import checkLatency from "./checkLatency";

const selectStorageProvider = async (storageApiClient) => {
    try {
        const res = await storageApiClient.queryGetActiveProviders();
        const providers = res.data.provider ?? [];
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
