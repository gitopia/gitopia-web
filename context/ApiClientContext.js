import React, { createContext, useState, useContext } from "react";
import { Api } from "@gitopia/gitopia-js/dist/rest";

const ApiClientContext = createContext();

export const useApiClient = () => {
  return useContext(ApiClientContext);
};

export const ApiClientProvider = ({ children }) => {
  const [apiClient, setApiClient] = useState(null);

  const updateApiClient = (apiNode) => {
    const newApiClient = new Api({ baseURL: apiNode });
    setApiClient(newApiClient);
  };

  return (
    <ApiClientContext.Provider value={{ apiClient, updateApiClient }}>
      {children}
    </ApiClientContext.Provider>
  );
};
