import React from "react";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useMemo } from "react";
import { useContext } from "react";
import Error404 from "./404";
import Router from "next/router";

const ErrorStatusContext = React.createContext();

const ErrorHandler = ({ children }) => {
  const [errorStatusCode, setErrorStatusCode] = useState(undefined);

  useEffect(() => {
    Router.events.on("routeChangeComplete", () =>
      setErrorStatusCode(undefined)
    );
  }, []);

  const renderContent = () => {
    if (errorStatusCode === 404) {
      return <Error404 />;
    }
    // ... more HTTP codes handled here

    return children;
  };

  const contextPayload = useMemo(
    () => ({ setErrorStatusCode }),
    [setErrorStatusCode]
  );

  return (
    <ErrorStatusContext.Provider value={contextPayload}>
      {renderContent()}
    </ErrorStatusContext.Provider>
  );
};

export const useErrorStatus = () => useContext(ErrorStatusContext);

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(ErrorHandler);
