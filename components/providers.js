import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import providers from "../providers.json";
import { setConfig } from "../store/actions/env";
import { useApiClient } from "../context/ApiClientContext";

const Providers = ({ selectedProvider, setSelectedProvider, setConfig }) => {
  const { updateApiClient } = useApiClient();
  const [customProvider, setCustomProvider] = useState({
    name: "Custom Provider",
    apiNode: "",
    rpcNode: "",
  });
  const [showCustomProviderInputs, setShowCustomProviderInputs] =
    useState(false);
  const [providersWithCustom, setProvidersWithCustom] = useState(providers);

  const chooseProvider = (provider) => {
    setSelectedProvider(provider);
    setConfig({
      config: {
        apiNode: provider.apiEndpoint,
        rpcNode: provider.rpcEndpoint,
      },
    });
    updateApiClient(provider.apiEndpoint);
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

  useEffect(() => {
    if (customProvider.apiEndpoint && customProvider.rpcEndpoint) {
      setProvidersWithCustom(...providersWithCustom, customProvider);
    }
    setSelectedProvider(customProvider);
    setConfig({
      config: {
        apiNode: customProvider.apiEndpoint,
        rpcNode: customProvider.rpcEndpoint,
      },
    });
  }, [customProvider]);

  return (
    <div className="flex flex-col p-4">
      <div className="text-sm font-semibold mb-2">API Provider</div>
      {providersWithCustom.map((provider) => (
        <button
          key={provider.name}
          onClick={() => chooseProvider(provider)}
          className={`btn rounded-full px-4 mb-2 relative justify-start ${
            selectedProvider && selectedProvider.name === provider.name
              ? "btn-primary"
              : "btn-ghost"
          }`}
        >
          <div className="ml-10 mr-2">
            <div className="text-xs text-left whitespace-nowrap">
              {provider.apiEndpoint}
              {selectedProvider && selectedProvider.name === provider.name && (
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
        Configure Custom Provider
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
          <button
            onClick={() => chooseProvider(customProvider)}
            className={`btn rounded-full px-4 mb-2 relative justify-start ${
              selectedProvider && selectedProvider.name === customProvider.name
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

export default connect(null, { setConfig })(Providers);
