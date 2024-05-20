import React, { createContext, useEffect, useState, useContext } from "react";
import { Api } from "@gitopia/gitopia-js/dist/rest";
import providers from "../providers.json";
import selectProvider from "../helpers/providerSelector";

const ApiClientContext = createContext();

export const useApiClient = () => {
  return useContext(ApiClientContext);
};

export const ApiClientProvider = ({ children }) => {
  const [apiClient, setApiClient] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateApiClient = (apiNode) => {
    const newApiClient = new Api({ baseURL: apiNode });
    setApiClient(newApiClient);
    localStorage.setItem("apiUrl", apiNode);
  };

  useEffect(() => {
    const cachedApiUrl =
      localStorage.getItem("apiUrl") ||
      providers[Math.floor(Math.random() * providers.length)].apiEndpoint; // Default API URL
    setApiUrl(cachedApiUrl);
    updateApiClient(cachedApiUrl);
  }, []);

  useEffect(() => {
    if (apiUrl) {
      const updateBestApiUrl = async () => {
        const bestApiProvider = await selectProvider();
        if (bestApiProvider.apiEndpoint !== apiUrl) {
          updateApiClient(bestApiProvider.apiEndpoint);
        }
        setLoading(false);
      };

      updateBestApiUrl();
    } else {
      setLoading(false);
    }
  }, [apiUrl]);

  return (
    <ApiClientContext.Provider value={{ apiClient, updateApiClient }}>
      {!loading && children}
    </ApiClientContext.Provider>
  );
};
