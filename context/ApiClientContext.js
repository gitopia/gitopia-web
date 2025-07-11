import React, { createContext, useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { Api } from "@gitopia/gitopia-js/dist/rest";
import { Api as CosmosBankApi } from "../store/cosmos.bank.v1beta1/module/rest";
import { Api as CosmosFeegrantApi } from "../store/cosmos.feegrant.v1beta1/rest";
import { Api as CosmosGovApi } from "../store/cosmos.gov.v1beta1/module/rest";
import { Api as IbcAppTransferApi } from "../store/ibc.applications.transfer.v1/module/rest";
import { Api as CosmosGroupApi } from "../store/cosmos.group.v1/rest";
import { Api as StorageApi } from "../store/gitopia.gitopia.storage/rest";
import selectProvider from "../helpers/providerSelector";
import selectStorageProvider from "../helpers/storageProviderSelector";
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
  const [cosmosGroupApiClient, setCosmosGroupApiClient] = useState(null);
  const [storageApiClient, setStorageApiClient] = useState(null);
  const [providerName, setProviderName] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [rpcUrl, setRpcUrl] = useState(null);
  const [storageApiUrl, setStorageApiUrl] = useState(null);
  const [storageProviderAddress, setStorageProviderAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const updateApiClient = (name, apiNode, rpcNode) => {
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

    const newCosmosGroupApiClient = new CosmosGroupApi({
      baseURL: apiNode,
    });
    setCosmosGroupApiClient(newCosmosGroupApiClient);

    const newStorageApiClient = new StorageApi({
      baseURL: apiNode,
    });
    setStorageApiClient(newStorageApiClient);

    selectStorageProvider(newStorageApiClient).then((provider) => {
      if (provider) {
        setStorageApiUrl(provider.apiUrl.replace(/\/$/, "")); // trim trailing slash
        setStorageProviderAddress(provider.creator);
      }
    });

    setProviderName(name);
    setApiUrl(apiNode);
    setRpcUrl(rpcNode);

    const providerInfo = JSON.stringify({
      name,
      apiEndpoint: apiNode,
      rpcEndpoint: rpcNode,
    });
    localStorage.setItem("providerInfo", providerInfo);

    dispatch(setConfig({ config: { apiNode, rpcNode } }));
  };

  useEffect(() => {
    const cachedProviderInfo = localStorage.getItem("providerInfo");

    const initializeApiProviders = async () => {
      if (cachedProviderInfo) {
        const { name, apiEndpoint, rpcEndpoint } =
          JSON.parse(cachedProviderInfo);
        setProviderName(name);
        setApiUrl(apiEndpoint);
        setRpcUrl(rpcEndpoint);
        updateApiClient(name, apiEndpoint, rpcEndpoint);
      } else {
        const bestApiProvider = await selectProvider();
        updateApiClient(
          bestApiProvider.name,
          bestApiProvider.apiEndpoint,
          bestApiProvider.rpcEndpoint
        );
        setProviderName(bestApiProvider.name);
        setApiUrl(bestApiProvider.apiEndpoint);
        setRpcUrl(bestApiProvider.rpcEndpoint);
      }
      setLoading(false);
    };

    initializeApiProviders();
  }, []);

  return (
    <ApiClientContext.Provider
      value={{
        providerName,
        apiUrl,
        rpcUrl,
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        cosmosGovApiClient,
        ibcAppTransferApiClient,
        cosmosGroupApiClient,
        storageApiClient,
        storageApiUrl,
        storageProviderAddress,
        updateApiClient,
      }}
    >
      {!loading && children}
    </ApiClientContext.Provider>
  );
};
