import Head from "next/head";
import Header from "../components/header";
import { useEffect, useState } from "react";
import CreateWallet from "../components/createWallet";
import RecoverWallet from "../components/recoverWallet";
import Footer from "../components/footer";
import ConnectLedger from "../components/connectLedger";
import CreateUser from "../components/createUser";
import { useRouter } from "next/router";
import { unlockKeplrWallet, unlockLeapWallet } from "../store/actions/wallet";
import { connect } from "react-redux";
import FundWallet from "../components/fundWallet";

/*
Wizard Steps
1 - Default selection screen
2 - Connect ledger
3 - Create new wallet
4 - Recover existing wallet
*/

function Login(props) {
  const { query, push } = useRouter();
  const [step, setStep] = useState(Number(query.step) || 1);

  useEffect(() => {
    setStep(Number(query.step) || 1);
  }, [query.step]);

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
              Please select a type of wallet to store your login information
            </div>
            <div className="max-w-lg w-full p-4">
              <div className="flex flex-col gap-2">
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost w-full focus:outline-none flex items-center"
                  onClick={(e) => {
                    push("/login?step=2");
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
                  onClick={async (e) => {
                    const acc = await props.unlockKeplrWallet();
                    if (acc) {
                      push("/home");
                    }
                  }}
                >
                  <img src="/keplr-logo.svg" className="w-20 h-20 p-2" />
                  <div className="ml-8">Connect Keplr</div>
                </button>
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost focus:outline-none flex items-center"
                  onClick={async (e) => {
                    const acc = await props.unlockLeapWallet();
                    if (acc) {
                      push("/home");
                    }
                  }}
                >
                  <img src="/metamask-fox.svg" className="w-20 h-20 p-2" />
                  <div className="ml-8">Connect Metamask (Flask)</div>
                </button>
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost focus:outline-none flex items-center"
                  onClick={(e) => {
                    push("/login?step=3");
                  }}
                  data-test="create-new-local-wallet"
                >
                  <img src="/new-wallet.svg" className="w-20 h-20" />
                  <div className="ml-8">Create new local wallet</div>
                </button>
                <button
                  className="flex-1 border-2 border-grey rounded-md bg-base-100 overflow-hidden px-8 py-2 btn-ghost focus:outline-none flex items-center"
                  onClick={(e) => {
                    push("/login?step=4");
                  }}
                  data-test="recover-local-wallet"
                >
                  <img src="/existing-wallet.svg" className="w-20 h-20" />
                  <div className="ml-8">Recover exisiting local wallet</div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <button
              className="btn btn-ghost btn-circle absolute left-4 top-0"
              onClick={(e) => {
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
        {step === 2 && <ConnectLedger />}
        {step === 3 && <CreateWallet />}
        {step === 4 && <RecoverWallet />}
        {step === 5 && <FundWallet />}
        {step === 6 && <CreateUser />}
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  unlockKeplrWallet,
  unlockLeapWallet,
})(Login);
