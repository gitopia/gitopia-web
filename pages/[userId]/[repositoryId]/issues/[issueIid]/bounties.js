import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import getRepositoryIssue from "../../../../../helpers/getRepositoryIssue";
import shrinkAddress from "../../../../../helpers/shrinkAddress";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import Footer from "../../../../../components/footer";
import useRepository from "../../../../../hooks/useRepository";
import IssuePullTitle from "../../../../../components/repository/issuePullTitle";
import { useErrorStatus } from "../../../../../hooks/errorHandler";
import pluralize from "../../../../../helpers/pluralize";
import IssueTabs from "../../../../../components/repository/issueTabs";
import {
  updateBountyExpiry,
  closeBounty,
} from "../../../../../store/actions/bounties";
import getBounties from "../../../../../helpers/getBounties";
import CreateBounty from "../../../../../components/repository/bounty";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryIssueView(props) {
  const router = useRouter();
  var id = router.query.userId;
  const { setErrorStatusCode } = useErrorStatus();
  const { repository } = useRepository();
  const [issue, setIssue] = useState({
    iid: router.query.issueIid,
    creator: "",
    description: "",
    comments: [],
    assignees: [],
    labels: [],
  });
  const [allLabels, setAllLabels] = useState([]);

  const [updatedExpiry, setUpdatedExpiry] = useState("");

  const [bounties, setBounties] = useState([]);
  const [closeBountyLoading, setCloseBountyLoading] = useState(false);
  const [bountyAmount, setBountyAmount] = useState([]);

  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  useEffect(async () => {
    const b = await getBounties();
    var bountyArray = [];
    b.map((bounty) => {
      bounty.parentId == issue.iid ? bountyArray.push(bounty) : "";
    });
    setBounties(bountyArray);
  }, [issue.iid]);

  useEffect(async () => {
    const [i] = await Promise.all([
      getRepositoryIssue(
        router.query.userId,
        router.query.repositoryId,
        router.query.issueIid
      ),
    ]);
    if (i) {
      setIssue(i);
    } else {
      setErrorStatusCode(404);
    }
    setAllLabels(repository.labels);
  }, [router.query.issueIid, repository.id]);

  const refreshIssue = async () => {
    const i = await getRepositoryIssue(
      repository.owner.id,
      repository.name,
      issue.iid
    );
    setIssue(i);
  };

  const refreshBounty = async () => {
    const b = await getBounties();
    var bountyArray = [];
    b.map((bounty) => {
      bounty.parentId == issue.iid ? bountyArray.push(bounty) : "";
    });
    setBounties(bountyArray);
  };
  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="issues" />
          <div className="mt-8">
            <IssuePullTitle
              issuePullObj={issue}
              repository={repository}
              onUpdate={refreshIssue}
            />
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={
                "flex items-center rounded-full border pl-4 pr-6 py-1 mr-4 " +
                (issue.state === "OPEN" ? "border-green-900" : "border-red-900")
              }
            >
              <span
                className={
                  "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                  (issue.state === "OPEN" ? "bg-green-900" : "bg-red-900")
                }
              />
              <span className="text-type text-sm uppercase">{issue.state}</span>
            </span>
            <span className="text-xs mr-2 text-type-secondary">
              {shrinkAddress(issue.creator) +
                " opened this issue " +
                dayjs(issue.createdAt * 1000).fromNow()}
            </span>
            <span className="text-xl mr-2 text-type-secondary">&middot;</span>
            <span className="text-xs text-type-secondary">
              {issue.comments.length}
              <span className="ml-1">
                {pluralize("comment", issue.comments.length)}
              </span>
            </span>
          </div>
          <IssueTabs
            repository={repository}
            issueId={issue.iid}
            active="bounties"
          />
          <div className="mt-8">
            <div className="flex">
              <div className="">Title goes here</div>
              <CreateBounty
                issue={issue}
                id={id}
                onUpdate={refreshBounty}
                bountyAmount={bountyAmount}
                setBountyAmount={setBountyAmount}
              />
            </div>
            {bounties.length > 0 ? (
              <div className="border border-gray-700 rounded mt-4 text-justify divide-y divide-gray-700">
                <div className="flex mt-2 mb-2">
                  <div className="w-1/4">
                    <div className="text-type-secondary text-sm ml-3">
                      Amount
                    </div>
                  </div>

                  <div className="w-1/6">
                    <div className="text-type-secondary text-sm ">
                      Wallet Address
                    </div>
                  </div>
                  <div className="w-1/6">
                    <div className="text-type-secondary text-sm ">
                      Expiry Date
                    </div>
                  </div>
                  <div className="w-1/6">
                    <div className="text-type-secondary text-sm ">Status</div>
                  </div>

                  <div className="text-type-secondary text-sm ml-auto mr-3">
                    Actions
                  </div>
                </div>

                {bounties.map((b, i) => {
                  return (
                    <div className="flex mt-2 mb-3 pt-3" key={i}>
                      <div className="w-1/4">
                        {b.amount.map((a) => {
                          return (
                            <div className="flex">
                              {a.denom == "utlore" ? (
                                <div className="ml-3 mt-0.5 mr-1">
                                  <svg
                                    width="8"
                                    height="14"
                                    viewBox="0 0 10 17"
                                    fill="none"
                                    className="mr-1 mt-px text-purple-50"
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
                                </div>
                              ) : (
                                <div className="ml-3"></div>
                              )}

                              <div className="text-sm mr-1">{a.denom}</div>
                              <div className="text-sm">{a.amount}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="w-1/6">
                        <div className="text-sm">
                          {shrinkAddress(b.creator)}
                        </div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-sm">
                          {dayjs
                            .unix(parseInt(b.expireAt))
                            .format("MMM D, YYYY")}
                        </div>
                      </div>
                      <div className="w-1/6">
                        {b.state == "BOUNTY_STATE_SRCDEBITTED" &&
                        b.expireAt > dayjs().unix() ? (
                          <div>
                            <div className="flex items-center rounded-full px-8 w-24 py-0.5 bg-purple text-xs uppercase mt-0.5">
                              Open
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {b.state == "BOUNTY_STATE_DESTCREDITED" ? (
                          <div className="flex items-center rounded-full px-4 w-24 py-0.5 bg-teal text-xs uppercase mt-0.5">
                            Rewarded
                          </div>
                        ) : (
                          ""
                        )}
                        {b.expireAt < dayjs().unix() &&
                        b.state != "BOUNTY_STATE_REVERTEDBACK" ? (
                          <div className="flex items-center rounded-full px-7 w-24 py-0.5 bg-pink text-xs uppercase mt-0.5">
                            Expired
                          </div>
                        ) : (
                          ""
                        )}
                        {b.state == "BOUNTY_STATE_REVERTEDBACK" ? (
                          <div className="flex items-center rounded-full px-5 w-24 py-0.5 bg-grey text-xs uppercase mt-0.5">
                            Reverted
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {b.expireAt < dayjs().unix() &&
                      b.state != "BOUNTY_STATE_REVERTEDBACK" ? (
                        <div className="flex ml-auto mr-3">
                          <div
                            className={
                              "btn btn-outline rounded text-xs border-green-900 btn-xs font-normal hover:bg-green hover:border-green-900 hover:text-white px-4 " +
                              (closeBountyLoading ? "loading" : "")
                            }
                            onClick={(e) => {
                              props.closeBounty(b.id).then((res) => {});
                            }}
                          >
                            CLOSE BOUNTY
                          </div>

                          <label
                            htmlFor="my-modal-2"
                            className={
                              "ml-2 btn modal-button btn-outline rounded text-xs border-green-900 btn-xs font-normal hover:bg-green hover:border-green-900 hover:text-white px-4 "
                            }
                          >
                            EXTEND EXPIRY
                          </label>
                          <input
                            type="checkbox"
                            id="my-modal-2"
                            className="modal-toggle"
                          />
                          <div className="modal">
                            <div className="modal-box relative">
                              <label
                                htmlFor="my-modal-2"
                                className="absolute right-4"
                                onClick={() => {
                                  setUpdatedExpiry("dd/mm/yyyy");
                                }}
                              >
                                <svg
                                  width="14"
                                  height="15"
                                  viewBox="0 0 14 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.5303 2.0304C13.8231 1.73751 13.8231 1.26264 13.5303 0.969744C13.2374 0.676851 12.7625 0.676851 12.4696 0.969744L13.5303 2.0304ZM0.46967 12.9697C0.176777 13.2626 0.176777 13.7374 0.46967 14.0303C0.762563 14.3232 1.23744 14.3232 1.53033 14.0303L0.46967 12.9697ZM12.4696 14.0303C12.7625 14.3231 13.2374 14.3231 13.5303 14.0303C13.8231 13.7374 13.8231 13.2625 13.5303 12.9696L12.4696 14.0303ZM1.53033 0.96967C1.23744 0.676777 0.762563 0.676777 0.46967 0.96967C0.176777 1.26256 0.176777 1.73744 0.46967 2.03033L1.53033 0.96967ZM12.4696 0.969744L0.46967 12.9697L1.53033 14.0303L13.5303 2.0304L12.4696 0.969744ZM13.5303 12.9696L1.53033 0.96967L0.46967 2.03033L12.4696 14.0303L13.5303 12.9696Z"
                                    fill="#E5EDF5"
                                  />
                                </svg>
                              </label>
                              <h3 className="text-lg">
                                Enter Extended Expiry Date
                              </h3>
                              <input
                                type="date"
                                placeholder="Enter Date"
                                className="appearance-none bg-transparent border-none leading-tight focus:outline-none ml-auto text-grey-200 text-md mt-2"
                                onChange={(e) => {
                                  setUpdatedExpiry(e.target.value);
                                }}
                              ></input>
                              <div className="modal-action">
                                <label
                                  htmlFor="my-modal-2"
                                  className="btn btn-primary btn-sm"
                                  onClick={(e) => {
                                    props
                                      .updateBountyExpiry(
                                        b.id,
                                        dayjs(updatedExpiry.toString()).unix()
                                      )
                                      .then((res) => {
                                        setUpdatedExpiry("");
                                        if (res && res.code === 0) {
                                          refreshBounty();
                                        }
                                      });
                                  }}
                                >
                                  Extend
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    advanceUser: state.user.advanceUser,
    loreBalance: state.wallet.loreBalance,
  };
};

export default connect(mapStateToProps, {
  updateBountyExpiry,
  closeBounty,
})(RepositoryIssueView);
