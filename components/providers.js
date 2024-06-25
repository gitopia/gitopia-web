import React, { useState } from "react";
import providers from "../providers.json";
import { useApiClient } from "../context/ApiClientContext";

const Providers = ({ selectedProvider, setSelectedProvider }) => {
  const { updateApiClient } = useApiClient();
  const [customProvider, setCustomProvider] = useState({
    name: "Custom",
    apiEndpoint: "",
    rpcEndpoint: "",
  });
  const [showCustomProviderInputs, setShowCustomProviderInputs] =
    useState(false);
  const [providersWithCustom, setProvidersWithCustom] = useState(providers);
  const [validationError, setValidationError] = useState("");

  const chooseProvider = (provider) => {
    setSelectedProvider(provider);
    updateApiClient(provider.name, provider.apiEndpoint, provider.rpcEndpoint);
  };

  const handleCustomProviderChange = (field, value) => {
    setCustomProvider((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const toggleCustomProviderInputs = () => {
    setShowCustomProviderInputs((prevState) => !prevState);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const checkApiResponse = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.code === 12 && data.message === "Not Implemented";
    } catch (error) {
      console.error("API validation failed:", error);
      return false;
    }
  };

  const checkRpcResponse = async (url) => {
    try {
      const response = await fetch(`${url}/status`);
      const data = await response.json();
      return !data.result.sync_info.catching_up;
    } catch (error) {
      console.error("RPC validation failed:", error);
      return false;
    }
  };

  const addCustomProvider = async () => {
    const { apiEndpoint, rpcEndpoint } = customProvider;

    if (!validateUrl(apiEndpoint) || !validateUrl(rpcEndpoint)) {
      setValidationError("Invalid URL format.");
      return;
    }

    const isApiValid = await checkApiResponse(apiEndpoint);
    const isRpcValid = await checkRpcResponse(rpcEndpoint);

    if (!isApiValid || !isRpcValid) {
      setValidationError("Failed to validate API or RPC endpoint.");
      return;
    }

    setProvidersWithCustom([...providersWithCustom, customProvider]);
    chooseProvider(customProvider);
    setValidationError("");
  };

  return (
    <div className="flex flex-col p-4">
      <div className="text-sm font-semibold mb-2">API Provider</div>
      {providersWithCustom.map((provider, i) => (
        <button
          key={i}
          onClick={() => chooseProvider(provider)}
          className={`btn rounded-full px-4 mb-2 relative justify-start ${
            selectedProvider &&
            selectedProvider.apiEndpoint === provider.apiEndpoint
              ? "btn-primary"
              : "btn-ghost"
          }`}
        >
          <div className="ml-2 mr-2">
            <div className="text-xs text-left whitespace-nowrap">
              {provider.name}
              {selectedProvider &&
                selectedProvider.apiEndpoint === provider.apiEndpoint && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                )}
            </div>
          </div>
        </button>
      ))}
      <button
        onClick={toggleCustomProviderInputs}
        className="btn btn-ghost rounded-full px-4 mb-2 relative justify-start"
      >
        Set Custom Provider
      </button>
      {showCustomProviderInputs && (
        <div className="mt-4">
          <div className="text-sm font-semibold mb-2">Custom Provider</div>
          <input
            type="text"
            placeholder="https://api.gitopia.com"
            value={customProvider.apiEndpoint}
            onChange={(e) =>
              handleCustomProviderChange("apiEndpoint", e.target.value)
            }
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            placeholder="https://rpc.gitopia.com"
            value={customProvider.rpcEndpoint}
            onChange={(e) =>
              handleCustomProviderChange("rpcEndpoint", e.target.value)
            }
            className="input input-bordered w-full mb-2"
          />
          {validationError && (
            <div className="text-red-500 text-xs mb-2">{validationError}</div>
          )}
          <button
            onClick={addCustomProvider}
            className={`btn rounded-full px-4 mb-2 relative justify-start ${
              selectedProvider &&
              selectedProvider.apiEndpoint === customProvider.apiEndpoint
                ? "btn-primary"
                : "btn-ghost"
            }`}
          >
            Use Custom Provider
          </button>
        </div>
      )}
    </div>
  );
};

export default Providers;
