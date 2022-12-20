import { assets } from "../ibc-assets-config";
export default async function getChainInfo(chainId) {
  console.log(chainId);
  let info = assets.filter((asset) => {
    return asset.chain_name === chainId;
  });
  return info[0];
}
