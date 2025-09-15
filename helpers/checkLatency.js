import axios from "axios";

const checkLatency = async (url) => {
  const startTime = Date.now();
  try {
    await axios.get(url);
    const endTime = Date.now();
    return endTime - startTime;
  } catch (error) {
    console.error(`Error checking latency for ${url}:`, error);
    return Infinity;
  }
};

export default checkLatency;
