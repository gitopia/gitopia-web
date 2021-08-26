import Head from "next/head";
import Image from "next/image";
import SimpleHeader from "../components/simpleHeader";
import { useState } from "react";
import CreateWallet from "../components/createWallet";
import RecoverWallet from "../components/recoverWallet";
import Footer from "../components/footer";

/*
Wizard Steps
1 - Default selection screen
2 - Create new wallet
3 - Recover existing wallet
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
      <SimpleHeader />
      <div className="flex-1 container mx-auto flex flex-col justify-center items-center min-h-full relative">
        {step === 1 ? (
          <>
            <div className="text-xs uppercase text-green mt-12 mb-2">
              Welcome to Gitopia
            </div>
            <div className="text-6xl mb-16">Access Gitopia</div>
            <div className="max-w-2xl w-full p-4">
              <div className="flex">
                <button
                  className="flex-1 border-2 border-grey rounded-md mr-4 bg-base-100 overflow-hidden px-8 py-4 w-60 btn-ghost focus:outline-none flex flex-col items-center"
                  onClick={(e) => {
                    setStep(2);
                  }}
                >
                  <Image src="new-wallet.svg" width="179px" height="131px" />
                  <div className="mt-4">Create new wallet</div>
                </button>
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-4 w-60 btn-ghost focus:outline-none flex flex-col items-center"
                  onClick={(e) => {
                    setStep(3);
                  }}
                >
                  <Image
                    src="existing-wallet.svg"
                    width="179px"
                    height="131px"
                  />
                  <div className="mt-4">Recover exisiting wallet</div>
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
              className="btn btn-ghost btn-circle absolute left-0 top-0"
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

        {step === 2 && <CreateWallet />}
        {step === 3 && <RecoverWallet />}
      </div>
      <Footer />
    </div>
  );
}
