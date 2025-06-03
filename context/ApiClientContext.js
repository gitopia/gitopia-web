import React, { createContext, useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import selectProvider from "../helpers/providerSelector";
import { setConfig } from "../store/actions/env";
import { gitopia } from "@gitopia/gitopiajs";

const ApiClientContext = createContext();

export const useApiClient = () => {
  return useContext(ApiClientContext);
};

export const ApiClientProvider = ({ children }) => {
  const [apiClient, setApiClient] = useState(null);
  const [providerName, setProviderName] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [rpcUrl, setRpcUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const updateApiClient = async (name, apiNode, rpcNode) => {
    const newApiClient = await gitopia.ClientFactory.createCustomLCDClient({
      restEndpoint: apiNode,
    });
    setApiClient(newApiClient);

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
        await updateApiClient(name, apiEndpoint, rpcEndpoint);
      } else {
        const bestApiProvider = await selectProvider();
        await updateApiClient(
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
        updateApiClient,
      }}
    >
      {!loading && children}
    </ApiClientContext.Provider>
  );
};
