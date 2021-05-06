import "../styles/globals.css";
// import "tailwindcss/tailwind.css";
// import Header from "../components/header";
// import { ChakraProvider } from "@chakra-ui/react";
// import theme from "../theme";
function MyApp({ Component, pageProps }) {
  return (
    // <ChakraProvider theme={theme}>
    <>
      {/* <Header /> */}
      <Component {...pageProps} />
    </>
    // </ChakraProvider>
  );
}

export default MyApp;
