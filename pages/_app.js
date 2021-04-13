import "../styles/globals.css";
import "rsuite/dist/styles/rsuite-dark.css";
import Header from "../components/header";
// import { Provider } from "react-redux";
import { wrapper } from "../store";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(MyApp);
