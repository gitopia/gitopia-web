import { useEffect, useState } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { getUserTransaction, txTypes } from "../../helpers/getUserTransactions";

function AccountTransactions(props) {
  const [userTransactions, setUserTransactions] = useState([]);
  const [pageTotal, setPageTotal] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPrevTransactions = async () => {
    const newData = await getUserTransaction(props.userId, 10, currentPage - 1);
    setCurrentPage(currentPage - 1);
    typeof newData.txs != undefined ? setUserTransactions(newData.txs) : "";
  };

  const loadNextTransactions = async () => {
    const newData = await getUserTransaction(props.userId, 10, currentPage + 1);
    setCurrentPage(currentPage + 1);
    typeof newData.txs != undefined ? setUserTransactions(newData.txs) : "";
  };

  useEffect(async () => {
    console.log(props.userId);
    const data = await getUserTransaction(props.userId);
    setUserTransactions(data.txs);
    setPageTotal(data.page_total);
  }, [props.userId]);

  return (
    <>
      <div className="mt-8">
        {typeof userTransactions !== "undefined"
          ? userTransactions.map((txs) => {
              return (
                <div key={txs.txhash}>
                  <div className="card  bordered mb-5 bg-gray-800 h-27 overflow-x-scroll">
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
                            {txTypes[txs.tx.value.msg[0].type] !== undefined ? (
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
                                    "/transactions/" +
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
                              dayjs(txs.timestamp).format("DD-MM-YYYY HH:mm A")}
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
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(AccountTransactions);
