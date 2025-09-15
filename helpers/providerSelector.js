import checkLatency from "./checkLatency";
import providers from "../providers.json";

const selectProvider = async () => {
  if (process.env.NODE_ENV === "production") {
    const latencies = await Promise.all(
      providers.map((p) => checkLatency(p.rpcEndpoint))
    );
    const lowestLatencyIndex = latencies.indexOf(Math.min(...latencies));
    return providers[lowestLatencyIndex];
  }

  return {
    apiEndpoint: process.env.NEXT_PUBLIC_API_URL,
    rpcEndpoint: process.env.NEXT_PUBLIC_RPC_URL,
  };
};

export default selectProvider;
