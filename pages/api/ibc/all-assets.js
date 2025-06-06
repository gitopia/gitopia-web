export default async function handler(req, res) {
  let url =
    process.env.NEXT_PUBLIC_IBC_ASSETS_REPO +
    (process.env.NEXT_PUBLIC_NETWORK_TYPE === "mainnet"
      ? "/gitopia/gitopia.json"
      : "/gitopia-janus-devnet-4/gitopia.json");
  let repoRes = await fetch(url);
  let data = await repoRes.text();
  res.setHeader(
    "cache-control",
    "public, s-maxage=3600, stale-while-revalidate=600"
  );

  return res.status(repoRes.status).send(data);
}