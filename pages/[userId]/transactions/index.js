import Head from "next/head";
import Header from "../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import PublicTabs from "../../../components/dashboard/publicTabs";
import Footer from "../../../components/footer";

import getUser from "../../../helpers/getUser";
import getOrganization from "../../../helpers/getOrganization";
import {
  getUserTransaction,
  txTypes,
} from "../../../components/user/getUserTransactions";
import UserHeader from "../../../components/user/header";

function TransactionView(props) {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    followers: [],
    following: [],
  });
  const [org, setOrg] = useState({
    name: "",
    followers: [],
    following: [],
  });
  const [userTransactions, setUserTransactions] = useState([]);
  const [pageTotal, setPageTotal] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(async () => {
    const data = await getUserTransaction(router.query.userId);
    setUserTransactions(data.txs);
    setPageTotal(data.page_total);
    const [u, o] = await Promise.all([
      getUser(router.query.userId),
      getOrganization(router.query.userId),
    ]);
    console.log(u, o);
    if (u) {
      setUser(u);
    } else if (o) {
      setOrg(o);
    }
  }, [router.query]);

  const loadPrevTransactions = async () => {
    const newData = await getUserTransaction(
      router.query.userId,
      10,
      currentPage - 1
    );
    setCurrentPage(currentPage - 1);
    typeof newData.txs != undefined ? setUserTransactions(newData.txs) : "";
  };

  const loadNextTransactions = async () => {
    const newData = await getUserTransaction(
      router.query.userId,
      10,
      currentPage + 1
    );
    setCurrentPage(currentPage + 1);
    typeof newData.txs != undefined ? setUserTransactions(newData.txs) : "";
  };

  const hrefBase = "/" + router.query.userId;
  const letter = user.id
    ? user.creator.slice(-1)
    : org.id
    ? org.name.slice(0, 1)
    : "x";

  const avatarLink =
    process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === org.address
      ? "/logo-g.svg"
      : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
        letter;

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{router.query.userId}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <UserHeader user={user} />
          <div className="flex flex-1 mt-8 border-b border-grey">
            <PublicTabs
              active="transactions"
              hrefBase={hrefBase}
              showPeople={org.address}
            />
          </div>
          <div className="mt-8">
            {typeof userTransactions !== "undefined"
              ? userTransactions.map((txs) => {
                  return (
                    <div key={txs.txhash}>
                      <div className="card  bordered mb-5 bg-gray-800 h-27">
                        <div className="flex">
                          {txs.tx.value !== "undefined" ? (
                            txTypes[txs.tx.value.msg[0].type] !== undefined ? (
                              <div
                                className={
                                  "h-20 w-2 rounded-full mr-7 ml-2 my-2 bg-" +
                                  txTypes[txs.tx.value.msg[0].type].color
                                }
                              ></div>
                            ) : (
                              <div
                                className={
                                  "h-20 w-2 rounded-full mr-7 ml-2 my-2 bg-gray-200"
                                }
                              ></div>
                            )
                          ) : (
                            ""
                          )}
                          <div className="my-4">
                            <div>
                              <div className="text-2xl">
                                {txTypes[txs.tx.value.msg[0].type] !==
                                undefined ? (
                                  <div
                                    className={
                                      "text-sm text-" +
                                      txTypes[txs.tx.value.msg[0].type].color
                                    }
                                  >
                                    {txTypes[txs.tx.value.msg[0].type].msg}
                                  </div>
                                ) : (
                                  <div className="text-sm">
                                    {txs.tx.value.msg[0].type}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <a className="text-xs text-type-secondary">
                                Tx Hash :
                              </a>
                              <a
                                className="text-xs text-type-secondary link link-primary no-underline hover:text-gray-100"
                                onClick={() => {
                                  if (window) {
                                    window.open(
                                      process.env.NEXT_PUBLIC_EXPLORER_URL +
                                        "/" +
                                        txs.txhash
                                    );
                                  }
                                }}
                              >
                                {" " + txs.txhash}
                              </a>
                            </div>
                            <div>
                              <p className="mt-2 text-xs text-type-secondary">
                                {"Timestamp: " +
                                  dayjs(txs.timestamp).format(
                                    "DD-MM-YYYY HH:mm A"
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
          {pageTotal > 0 ? (
            <div className="flex">
              <div className="">
                <button
                  className={"btn btn-sm"}
                  disabled={currentPage < 2}
                  onClick={() => {
                    loadPrevTransactions();
                    window.scrollTo(0, 0);
                  }}
                >
                  PREV
                </button>
              </div>
              <div className="ml-auto self-center">
                <button
                  className={"btn btn-sm"}
                  disabled={pageTotal == currentPage}
                  onClick={() => {
                    loadNextTransactions();
                    window.scrollTo(0, 0);
                  }}
                >
                  NEXT
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(TransactionView);
