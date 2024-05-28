import React, { createContext, useEffect, useState, useContext } from "react";
import { Api } from "@gitopia/gitopia-js/dist/rest";
import { Api as CosmosBankApi } from "../store/cosmos.bank.v1beta1/module/rest";
import { Api as CosmosFeegrantApi } from "../store/cosmos.feegrant.v1beta1/rest";
import providers from "../providers.json";
import selectProvider from "../helpers/providerSelector";

const ApiClientContext = createContext();

export const useApiClient = () => {
  return useContext(ApiClientContext);
};

export const ApiClientProvider = ({ children }) => {
  const [apiClient, setApiClient] = useState(null);
  const [cosmosBankApiClient, setCosmosBankApiClient] = useState(null);
  const [cosmosFeegrantApiClient, setCosmosFeegrantApiClient] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [rpcUrl, setRpcUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateApiClient = (apiNode, rpcNode) => {
    const newApiClient = new Api({ baseURL: apiNode });
    setApiClient(newApiClient);

    const newCosmosBankApiClient = new CosmosBankApi({ baseURL: apiNode });
    setCosmosBankApiClient(newCosmosBankApiClient);

    const newCosmosFeegrantApiClient = new CosmosFeegrantApi({
      baseURL: apiNode,
    });
    setCosmosFeegrantApiClient(newCosmosFeegrantApiClient);

    localStorage.setItem("apiUrl", apiNode);
    localStorage.setItem("rpcUrl", rpcNode);
  };

  useEffect(() => {
    const cachedApiUrl = localStorage.getItem("apiUrl");
    const cachedRpcUrl = localStorage.getItem("rpcUrl");

    if (cachedApiUrl) {
      setApiUrl(cachedApiUrl);
      setRpcUrl(cachedRpcUrl);
      updateApiClient(cachedApiUrl);
    }
  }, []);

  useEffect(() => {
    if (apiUrl) {
      const updateBestApiUrl = async () => {
        const bestApiProvider = await selectProvider();
        if (bestApiProvider.apiEndpoint !== apiUrl) {
          updateApiClient(bestApiProvider.apiEndpoint);
          setRpcUrl(bestApiProvider.rpcEndpoint);
        }
        setLoading(false);
      };

      updateBestApiUrl();
    } else {
      setLoading(false);
    }
  }, [apiUrl]);

  return (
    <ApiClientContext.Provider
      value={{
        apiUrl,
        rpcUrl,
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        updateApiClient,
      }}
    >
      {!loading && children}
    </ApiClientContext.Provider>
  );
};
