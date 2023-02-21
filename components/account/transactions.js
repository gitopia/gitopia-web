import { useEffect, useState } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import QueryUserTransactions from "../../helpers/gql/queryUserTransactions";
import { txTypes } from "../../helpers/transactionsTypes";
import { ApolloProvider } from "@apollo/client";
import client from "../../helpers/apolloClient";
import classNames from "classnames";

function AccountTransactions(props) {
  const [userTransactions, setUserTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState([]);
  const [pageTotal, setPageTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const loadPrevTransactions = async () => {
    setCurrentPage(currentPage - 1);
    setStart(start - 10);
    setEnd(end - 10);
    setShowTransactions(userTransactions.slice(start, end));
  };

  const loadNextTransactions = async () => {
    setCurrentPage(currentPage + 1);
    setStart(start + 10);
    setEnd(end + 10);
    setShowTransactions(userTransactions.slice(start, end));
  };

  useEffect(() => {
    if (userTransactions.length > 0) {
      setPageTotal(Math.ceil(userTransactions.length / 10));
      setShowTransactions(userTransactions.slice(start, end));
    }
  }, [userTransactions]);

  return (
    <>
      <div className="mt-8">
        <ApolloProvider client={client}>
          <QueryUserTransactions
            setUserTransactions={setUserTransactions}
            creator={props.userId}
          />
        </ApolloProvider>
        {showTransactions?.map((txs) => {
          return (
            <div key={txs.txHash}>
              <div className="card  bordered mb-5 bg-gray-800 h-27 overflow-x-auto">
                <div className="flex">
                  {
                    <div
                      className={classNames(
                        "h-20 w-2 rounded-full mr-7 ml-2 my-2",
                        txTypes[txs.message]?.bg_color
                          ? txTypes[txs.message]?.bg_color
                          : "bg-gray-200"
                      )}
                    ></div>
                  }
                  <div className="my-4">
                    <div>
                      <div className="text-2xl">
                        {txTypes[txs.message] ? (
                          <div
                            className={
                              "text-sm " + txTypes[txs.message]?.text_color
                            }
                          >
                            {txTypes[txs.message]?.msg}
                          </div>
                        ) : (
                          <div className="text-sm">{txs.message}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <a className="text-xs text-type-secondary">Tx Hash :</a>
                      <a
                        className="text-xs text-type-secondary link link-primary no-underline hover:text-gray-100"
                        onClick={() => {
                          if (window) {
                            window.open(
                              process.env.NEXT_PUBLIC_EXPLORER_URL +
                                "/transactions/" +
                                txs.txHash
                            );
                          }
                        }}
                      >
                        {" " + txs.txHash}
                      </a>
                    </div>
                    <div>
                      <p className="mt-2 text-xs text-type-secondary">
                        {"Timestamp: " +
                          dayjs
                            .unix(txs.createdAt)
                            .format("DD-MM-YYYY HH:mm A")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(AccountTransactions);
