import React, { createContext, useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { Api } from "@gitopia/gitopia-js/dist/rest";
import { Api as CosmosBankApi } from "../store/cosmos.bank.v1beta1/module/rest";
import { Api as CosmosFeegrantApi } from "../store/cosmos.feegrant.v1beta1/rest";
import { Api as CosmosGovApi } from "../store/cosmos.gov.v1beta1/module/rest";
import { Api as IbcAppTransferApi } from "../store/ibc.applications.transfer.v1/module/rest";
import selectProvider from "../helpers/providerSelector";
import { setConfig } from "../store/actions/env";

const ApiClientContext = createContext();

export const useApiClient = () => {
  return useContext(ApiClientContext);
};

export const ApiClientProvider = ({ children }) => {
  const [apiClient, setApiClient] = useState(null);
  const [cosmosBankApiClient, setCosmosBankApiClient] = useState(null);
  const [cosmosFeegrantApiClient, setCosmosFeegrantApiClient] = useState(null);
  const [cosmosGovApiClient, setCosmosGovApiClient] = useState(null);
  const [ibcAppTransferApiClient, setIbcAppTransferApiClient] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [rpcUrl, setRpcUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const updateApiClient = (apiNode, rpcNode) => {
    const newApiClient = new Api({ baseURL: apiNode });
    setApiClient(newApiClient);

    const newCosmosBankApiClient = new CosmosBankApi({ baseUrl: apiNode });
    setCosmosBankApiClient(newCosmosBankApiClient);

    const newCosmosFeegrantApiClient = new CosmosFeegrantApi({
      baseURL: apiNode,
    });
    setCosmosFeegrantApiClient(newCosmosFeegrantApiClient);

    const newCosmosGovApiClient = new CosmosGovApi({ baseUrl: apiNode });
    setCosmosGovApiClient(newCosmosGovApiClient);

    const newIbcAppTransferApiClient = new IbcAppTransferApi({
      baseUrl: apiNode,
    });
    setIbcAppTransferApiClient(newIbcAppTransferApiClient);

    setApiUrl(apiNode);
    setRpcUrl(rpcNode);

    localStorage.setItem("apiUrl", apiNode);
    localStorage.setItem("rpcUrl", rpcNode);

    dispatch(setConfig({ config: { apiNode, rpcNode } }));
  };

  useEffect(() => {
    const cachedApiUrl = localStorage.getItem("apiUrl");
    const cachedRpcUrl = localStorage.getItem("rpcUrl");

    if (cachedApiUrl) {
      setApiUrl(cachedApiUrl);
      setRpcUrl(cachedRpcUrl);
      updateApiClient(cachedApiUrl, cachedRpcUrl);
    }
  }, []);

  useEffect(() => {
    const updateBestApiUrl = async () => {
      const bestApiProvider = await selectProvider();
      if (bestApiProvider.apiEndpoint !== apiUrl) {
        updateApiClient(
          bestApiProvider.apiEndpoint,
          bestApiProvider.rpcEndpoint
        );
        setApiUrl(bestApiProvider.apiEndpoint);
        setRpcUrl(bestApiProvider.rpcEndpoint);
      }
      setLoading(false);
    };
    updateBestApiUrl();
  }, []);

  return (
    <ApiClientContext.Provider
      value={{
        apiUrl,
        rpcUrl,
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        cosmosGovApiClient,
        ibcAppTransferApiClient,
        updateApiClient,
      }}
    >
      {!loading && children}
    </ApiClientContext.Provider>
  );
};
