import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { connect } from "react-redux";
function Drawer(props) {
  const router = useRouter();
  return (
    <main
      className={
        " fixed overflow-hidden z-20 bg-base-100 bg-opacity-25 inset-0 transform ease-in-out " +
        (props.isOpen
          ? " transition-opacity opacity-100 duration-300 translate-x-0  "
          : " transition-all delay-500 opacity-0 -translate-x-full  ")
      }
    >
      <section
        className={
          " w-2/3 max-w-xs left-0 absolute bg-base-200 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (props.isOpen ? " translate-x-0 " : " -translate-x-full ")
        }
      >
        <div className="relative max-w-xs pb-10 flex flex-col space-y-6 overflow-y-scroll overflow-x-hidden h-full">
          <header className="font-bold text-lg border-b border-grey py-4 content-center">
            <div
              className={
                "flex-none px-8 transition-all ease-out delay-150" +
                (router.pathname === "/home" ? " w-64" : " w-42")
              }
            >
              <Link href={props.homeUrl}>
                <img
                  width={80}
                  src="/logo-white.svg"
                  className="cursor-pointer mt-2"
                ></img>
              </Link>
            </div>
          </header>
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-200">
            {props.activeWallet ? (
              <div className="flex flex-row mx-4 mt-auto">
                <svg
                  width="12"
                  height="18"
                  viewBox="0 0 10 17"
                  fill="none"
                  className="mt-1.5 mr-1 text-purple-50"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.00061 8.51845C6.33523 8.51845 7.41715 7.43653 7.41715 6.10192C7.41715 4.7673 6.33523 3.68538 5.00061 3.68538C3.666 3.68538 2.58408 4.7673 2.58408 6.10192C2.58408 7.43653 3.666 8.51845 5.00061 8.51845ZM5.00061 10.2314C7.28128 10.2314 9.13013 8.38259 9.13013 6.10192C9.13013 3.82125 7.28128 1.9724 5.00061 1.9724C2.71994 1.9724 0.871094 3.82125 0.871094 6.10192C0.871094 8.38259 2.71994 10.2314 5.00061 10.2314Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.58408 11.1195C2.58408 11.7593 2.84059 12.3714 3.29468 12.8215C3.74849 13.2713 4.36229 13.5225 5.00061 13.5225C5.63893 13.5225 6.25273 13.2713 6.70655 12.8215C7.16063 12.3714 7.41715 11.7593 7.41715 11.1195H9.13013C9.13013 12.2004 8.69698 13.2386 7.92343 14.0053C7.14962 14.7723 6.09841 15.2046 5.00061 15.2046C3.90281 15.2046 2.8516 14.7723 2.07779 14.0053C1.30425 13.2386 0.871094 12.2004 0.871094 11.1195H2.58408Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4.19727 0.743828H5.8455V2.39206H4.19727V0.743828Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4.19727 14.7537H5.8455V16.4019H4.19727V14.7537Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="text-purple-50 uppercase text-xl mb-3">
                  {props.advanceUser === true
                    ? props.balance
                    : props.balance / 1000000}{" "}
                  {props.advanceUser === true
                    ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                    : process.env.NEXT_PUBLIC_CURRENCY_TOKEN}
                </div>
              </div>
            ) : (
              ""
            )}
            <li>
              <a
                className="hover:bg-gray-700"
                href={process.env.NEXT_PUBLIC_EXPLORER_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  props.setIsOpen(false);
                }}
              >
                Explorer
              </a>
            </li>
            <li>
              <a
                className="hover:bg-gray-700"
                href={process.env.NEXT_PUBLIC_DOCS_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  props.setIsOpen(false);
                }}
              >
                Docs
              </a>
            </li>
            <li>
              <a
                className="hover:bg-gray-700"
                href={process.env.NEXT_PUBLIC_FORUM_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  props.setIsOpen(false);
                }}
              >
                Forum
              </a>
            </li>

            {process.env.NEXT_PUBLIC_NETWORK_RELEASE_NOTES ? (
              <div className="flex-col mr-8 items-end mx-4 mt-5">
                <div
                  className="uppercase text-type-secondary"
                  style={{ fontSize: "0.6rem", lineHeight: "1rem" }}
                >
                  {props.chainId}
                </div>
                <div style={{ fontSize: "0.6rem", lineHeight: "1rem" }}>
                  <a
                    className="link link-primary no-underline"
                    target="_blank"
                    rel="noreferrer"
                    href={process.env.NEXT_PUBLIC_NETWORK_RELEASE_NOTES}
                  >
                    SEE WHATS NEW
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}
          </ul>
        </div>
      </section>
      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => {
          props.setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
const mapStateToProps = (state) => {
  return {
    activeWallet: state.wallet.activeWallet,
    selectedAddress: state.wallet.selectedAddress,
    balance: state.wallet.balance,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {})(Drawer);
