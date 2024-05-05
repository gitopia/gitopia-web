import React from "react";
import { connect } from "react-redux";
import providers from "../providers.json";
import { setConfig } from "../store/actions/env";

const Providers = ({ selectedProvider, setSelectedProvider, setConfig }) => {
  const chooseProvider = (provider) => {
    setSelectedProvider(provider);
    setConfig({
      config: {
        apiNode: provider.apiEndpoint,
        rpcNode: provider.rpcEndpoint,
      },
    });
  };

  return (
    <div className="flex flex-col p-4">
      <div className="text-sm font-semibold mb-2">API Provider</div>
      {providers.map((provider) => (
        <button
          key={provider.name}
          onClick={() => chooseProvider(provider)}
          className={`btn rounded-full px-4 mb-2 relative justify-start ${selectedProvider && selectedProvider.name === provider.name
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
    </div>
  );
};

export default connect(null, { setConfig })(Providers);