import Head from "next/head";
import Header from "../components/header";
import { useEffect, useState } from "react";
import CreateWallet from "../components/createWallet";
import RecoverWallet from "../components/recoverWallet";
import Footer from "../components/footer";
import ConnectLedger from "../components/connectLedger";
import CreateUser from "../components/createUser";
import { useRouter } from "next/router";
import {
  unlockLedgerWallet,
  unlockMetamaskWallet,
} from "../store/actions/wallet";
import FundWallet from "../components/fundWallet";
import { useApiClient } from "../context/ApiClientContext";
import { useChain, useWalletClient } from "@cosmos-kit/react";
import { Wallet } from "lucide-react";
import { useDispatch } from "react-redux";
import { walletActions } from "../store/actions/actionTypes";
import { LedgerClient } from "@cosmos-kit/ledger/cjs/web-usb-hid";

function Login() {
  const { query, push } = useRouter();
  const [step, setStep] = useState(Number(query.step) || 1);
  const { apiClient, apiUrl } = useApiClient();
  const dispatch = useDispatch();

  // Initialize Gitopia chain context
  const { connect, openView, status, address } = useChain("gitopia");
  const { client } = useWalletClient();

  useEffect(() => {
    setStep(Number(query.step) || 1);
  }, [query.step]);

  // Watch for successful connections
  useEffect(() => {
    if (status === "Connected" && address && client) {
      console.log("login: client", client);
      if (client instanceof LedgerClient) {
        dispatch(unlockLedgerWallet(apiClient, client));
      } else {
        dispatch(unlockMetamaskWallet(apiClient, client));
      }
      // push("/home");
    }
  }, [status, address, client]);

  const handleWalletConnection = async (walletName) => {
    try {
      await connect(walletName);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen flex flex-col"
    >
      <Head>
        <title>Gitopia - Login</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="mt-4 sm:mt-12 px-4 container mx-auto flex flex-1 flex-col justify-start items-center min-h-full relative">
        {step === 1 ? (
          <>
            <div className="text-4xl mt-16 sm:mt-0 sm:text-6xl mb-6">
              Access Gitopia
            </div>
            <div className="text-xs text-type-secondary mb-8">
              Please select how you would like to access your wallet
            </div>
            <div className="max-w-lg w-full p-4">
              <div className="flex flex-col gap-4">
                <button
                  className="relative w-full h-16 rounded-lg overflow-hidden px-8 py-2 focus:outline-none"
                  onClick={openView}
                >
                  {/* Gradient background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)",
                      opacity: 1,
                    }}
                  />

                  {/* Content */}
                  <div className="relative flex items-center justify-center text-white gap-4">
                    <Wallet size={24} />
                    <span className="text-lg font-medium">Connect Wallet</span>
                  </div>
                </button>

                <div className="flex flex-row items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-gray-700"></div>
                  <span className="text-sm text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gray-700"></div>
                </div>

                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost focus:outline-none flex items-center"
                  onClick={() => {
                    push("/login?step=3");
                  }}
                  data-test="create-new-local-wallet"
                >
                  <img src="/new-wallet.svg" className="w-20 h-20" />
                  <div className="ml-8">Create new local wallet</div>
                </button>
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost focus:outline-none flex items-center"
                  onClick={() => {
                    push("/login?step=4");
                  }}
                  data-test="recover-local-wallet"
                >
                  <img src="/existing-wallet.svg" className="w-20 h-20" />
                  <div className="ml-8">Recover existing local wallet</div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <button
              className="btn btn-ghost btn-circle absolute left-4 top-0"
              onClick={() => {
                if (step === 6) {
                  push("/login?step=5");
                } else {
                  push("/login?step=1");
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </div>
        )}
        {step === 3 && <CreateWallet />}
        {step === 4 && <RecoverWallet />}
        {step === 5 && <FundWallet />}
        {step === 6 && <CreateUser />}
      </div>
      <Footer />
    </div>
  );
}

export default Login;
