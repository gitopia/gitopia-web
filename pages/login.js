import Head from "next/head";
import Header from "../components/header";
import { useState } from "react";
import CreateWallet from "../components/createWallet";
import RecoverWallet from "../components/recoverWallet";
import Footer from "../components/footer";
import ConnectLedger from "../components/connectLedger";

/*
Wizard Steps
1 - Default selection screen
2 - Connect ledger
3 - Create new wallet
4 - Recover existing wallet
*/

export default function Login(props) {
  const [step, setStep] = useState(1);
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
      <div className="mt-4 sm:mt-12 px-4 container mx-auto flex flex-1 flex-col justify-center items-center min-h-full relative">
        {step === 1 ? (
          <>
            <div className="text-xs uppercase text-green mt-12 mb-2">
              Welcome to Gitopia
            </div>
            <div className="text-4xl sm:text-6xl mb-8 sm:mb-16">
              Access Gitopia
            </div>
            <div className="max-w-lg w-full p-4">
              <div className="flex flex-col gap-2">
                <button
                  className="flex-1 border-2 border-primary rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost w-full focus:outline-none hover:border-primary flex items-center"
                  onClick={(e) => {
                    setStep(2);
                  }}
                >
                  <img src="/new-wallet-ledger.svg" className="w-20 h-20" />
                  <div className="ml-8">
                    <span>Connect Ledger</span>{" "}
                    <span className="badge badge-priamry ml-2">
                      Recommended
                    </span>
                  </div>
                </button>
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost focus:outline-none flex items-center"
                  onClick={(e) => {
                    setStep(3);
                  }}
                  data-test="create-new-local-wallet"
                >
                  <img src="/new-wallet.svg" className="w-20 h-20" />
                  <div className="ml-8">Create new local wallet</div>
                </button>
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost focus:outline-none flex items-center"
                  onClick={(e) => {
                    setStep(4);
                  }}
                  data-test="recover-local-wallet"
                >
                  <img src="/existing-wallet.svg" className="w-20 h-20" />
                  <div className="ml-8">Recover exisiting wallet</div>
                </button>
              </div>
            </div>
            <div className="text-sm mt-2 mb-16 max-w-md text-center">
              In order to use Gitopia, you need to use a wallet to sign in. You
              can use an existing one or create an entirely new one here
            </div>
          </>
        ) : (
          <div>
            <button
              className="btn btn-ghost btn-circle absolute left-4 top-0"
              onClick={(e) => {
                setStep(1);
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
        {step === 2 && <ConnectLedger />}
        {step === 3 && <CreateWallet />}
        {step === 4 && <RecoverWallet />}
      </div>
      <Footer />
    </div>
  );
}
