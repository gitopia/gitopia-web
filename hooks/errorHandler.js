import React from "react";
import { useState, useEffect } from "react";
import { useMemo } from "react";
import { useContext } from "react";
import Error404 from "../pages/404";
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
export default ErrorHandler;
