import { useEffect, useState } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import { getUserTransaction, txTypes } from "../../helpers/getUserTransactions";
import classNames from "classnames";

function AccountTransactions(props) {
  const [userTransactions, setUserTransactions] = useState([]);
  const [pageTotal, setPageTotal] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPrevTransactions = async () => {
    setCurrentPage(currentPage - 1);
  };

  const loadNextTransactions = async () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    async function initTransactions() {
      const data = await getUserTransaction(props.userId, 10, currentPage);
      setUserTransactions(data.tx_responses);
      setPageTotal(Math.ceil(data.total / 10));
    }
    initTransactions();
  }, [props.userId, currentPage]);

  return (
    <>
      <div className="mt-8">
        {userTransactions?.map((txs) => {
          return (
            <div key={txs.txhash}>
              <div className="card  bordered mb-5 bg-gray-800 h-27 overflow-x-auto">
                <div className="flex">
                  {
                    <div
                      className={classNames(
                        "h-20 w-2 rounded-full mr-7 ml-2 my-2",
                        txTypes[txs.tx.body.messages[0]["@type"]]?.bg_color
                          ? txTypes[txs.tx.body.messages[0]["@type"]]?.bg_color
                          : "bg-gray-200"
                      )}
                    ></div>
                  }
                  <div className="my-4">
                    <div>
                      <div className="text-2xl">
                        {txTypes[txs?.tx.body.messages[0]["@type"]] ? (
                          <div
                            className={
                              "text-sm " +
                              txTypes[txs.tx.body.messages[0]["@type"]]
                                ?.text_color
                            }
                          >
                            {txTypes[txs.tx.body.messages[0]["@type"]]?.msg}
                          </div>
                        ) : (
                          <div className="text-sm">
                            {txs.tx.body.messages[0]["@type"]}
                          </div>
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
