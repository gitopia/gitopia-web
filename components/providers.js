import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import providers from "../providers.json";
import selectProvider from "../helpers/providerSelector";
import { setConfig } from "../store/actions/env";

const Providers = (props) => {
  const [selectedProvider, setSelectedProvider] = useState({ apiEndpoint: "" });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const selectProviderAsync = async () => {
      const provider = await selectProvider();
      setSelectedProvider(provider);
      props.setConfig({
        config: {
          apiNode: provider.apiEndpoint,
          rpcNode: provider.rpcEndpoint,
        },
      });
      console.log(
        `Selected provider ${provider.rpcEndpoint} based on least latency`
      );
    };
    selectProviderAsync();
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const chooseProvider = (p) => {
    setSelectedProvider(p);
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className="btn btn-ghost rounded-full px-4 mb-2 relative justify-start"
      >
        <div className="ml-10 mr-2">
          <div className="text-xs text-left whitespace-nowrap">
            {selectedProvider.apiEndpoint}
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="flex flex-col">
          API Provider
          {providers.map((p, i) => {
            const isSelected = p.name === selectProvider.name;

            return (
              <button
                onClick={(e) => {
                  chooseProvider(p);
                }}
                className={
                  "btn rounded-full px-4 mb-2 relative justify-start" +
                  (isSelected ? " btn-primary" : " btn-ghost")
                }
                key={i}
              >
                <div className={"ml-10" + (isSelected ? " mr-6" : " mr-2")}>
                  <div className="text-xs text-left whitespace-nowrap">
                    {p.apiEndpoint}
                    {isSelected ? (
                      <span className="mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default connect(null, {
  setConfig,
})(Providers);
