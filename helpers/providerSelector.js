import checkLatency from "./checkLatency";
import providers from "../providers.json";

const selectProvider = async () => {
  const latencies = await Promise.all(providers.map(checkLatency));
  const lowestLatencyIndex = latencies.indexOf(Math.min(...latencies));
  return providers[lowestLatencyIndex];
};

export default selectProvider;
