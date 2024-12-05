import axios from "axios";

const checkLatency = async (provider) => {
  const startTime = Date.now();
  try {
    await axios.get(provider.rpcEndpoint);
    const endTime = Date.now();
    return endTime - startTime;
  } catch (error) {
    console.error(`Error checking latency for ${provider.rpcEndpoint}:`, error);
    return Infinity;
  }
};

export default checkLatency;
