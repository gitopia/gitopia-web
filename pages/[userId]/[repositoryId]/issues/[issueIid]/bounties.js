import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import getIssue from "../../../../../helpers/getIssue";
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
import CreateBounty from "../../../../../components/repository/bounty";
import ExtendExpiry from "../../../../../components/repository/extendExpiry";
import getBounty from "../../../../../helpers/getBounty";
import getDenomNameByHash from "../../../../../helpers/getDenomNameByHash";
import { coingeckoId } from "../../../../../ibc-assets-config";
import getIssueCommentAll from "../../../../../helpers/getIssueCommentAll";
import useWindowSize from "../../../../../hooks/useWindowSize";
import { useApiClient } from "../../../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryBountiesView(props) {
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
    bounties: [],
  });

  const [updatedExpiry, setUpdatedExpiry] = useState("");
  const [bountyId, setBountyId] = useState(null);
  const [bounties, setBounties] = useState([]);
  const [closeBountyLoading, setCloseBountyLoading] = useState(false);
  const [bountyAmount, setBountyAmount] = useState([]);
  const { isMobile } = useWindowSize();
  const {
    apiClient,
    cosmosBankApiClient,
    cosmosFeegrantApiClient,
    ibcAppTransferApiClient,
  } = useApiClient();

  useEffect(() => {
    async function fetchBounty() {
      const array = [];
      for (var i = 0; i < issue.bounties.length; i++) {
        const res = await getBounty(apiClient, issue.bounties[i]);
        const bounty = await updateDenomName(res);
        array.push(bounty);
      }
      setBounties(array);
    }
    fetchBounty();
  }, [issue.bounties]);

  useEffect(() => {
    async function fetchIssue() {
      const [i, c] = await Promise.all([
        getIssue(
          apiClient,
          router.query.userId,
          router.query.repositoryId,
          router.query.issueIid
        ),
        getIssueCommentAll(apiClient, repository.id, router.query.issueIid),
      ]);
      if (i) {
        i.comments = c;
        setIssue(i);
      } else {
        setErrorStatusCode(404);
      }
    }
    fetchIssue();
  }, [router.query.issueIid, repository.id]);

  async function updateDenomName(bounty) {
    for (let i = 0; i < bounty.amount.length; i++) {
      if (bounty.amount[i].denom.includes("ibc")) {
        let denomName = await getDenomNameByHash(
          ibcAppTransferApiClient,
          bounty.amount[i].denom
        );
        bounty.amount[i].denom = denomName;
        if (denomName) {
          bounty.amount[i].standardDenomName = coingeckoId[denomName].coinDenom;
          bounty.amount[i].amount =
            bounty.amount[i].amount /
            Math.pow(10, coingeckoId[denomName].coinDecimals);
        }
      } else {
        bounty.amount[i].standardDenomName =
          coingeckoId[bounty.amount[i].denom].coinDenom;
        bounty.amount[i].amount =
          bounty.amount[i].amount /
          Math.pow(10, coingeckoId[bounty.amount[i].denom].coinDecimals);
      }
    }
    return bounty;
  }

  const refreshIssue = async () => {
    const [i, c] = await Promise.all([
      getIssue(
        apiClient,
        router.query.userId,
        router.query.repositoryId,
        router.query.issueIid
      ),
      getIssueCommentAll(apiClient, repository.id, router.query.issueIid),
    ]);
    if (i) {
      i.comments = c;
      setIssue(i);
    }
  };

  const refreshBounty = async () => {
    refreshIssue();
    const array = [];
    for (var i = 0; i < issue.bounties.length; i++) {
      const res = await getBounty(apiClient, issue.bounties[i]);
      const bounty = await updateDenomName(res);
      array.push(bounty);
    }
    setBounties(array);
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
              {issue.comments?.length}
              <span className="ml-1">
                {pluralize("comment", issue.comments?.length)}
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
              <div className="">Attached Bounties</div>
              <CreateBounty
                issue={issue}
                id={id}
                repository={repository}
                onUpdate={refreshBounty}
                bountyAmount={bountyAmount}
                setBountyAmount={setBountyAmount}
              />
            </div>
            {bounties.length > 0 ? (
              <div
                className={
                  "border border-grey-50 rounded mt-4 text-justify sm:divide-y sm:divide-gray-700 overflow-y-visible " +
                  (isMobile ? "overflow-x-auto" : "")
                }
              >
                <div className="flex mt-2 mb-2 ml-3">
                  <div className="sm:w-1/4">
                    <div className="w-56 sm:w-full text-type-secondary text-sm ml-3">
                      Amount
                    </div>
                  </div>

                  <div className="sm:w-1/6 ">
                    <div className="w-28 sm:w-full mr-2 sm:mr-0 text-type-secondary text-sm">
                      Wallet Address
                    </div>
                  </div>
                  <div className="sm:w-1/6 ">
                    <div className="w-36 sm:w-full mr-4 sm:mr-0 text-type-secondary text-sm">
                      Expiry Date
                    </div>
                  </div>
                  <div className="sm:w-1/6 ">
                    <div className="text-type-secondary text-sm ">Status</div>
                  </div>

                  <div className="w-1/4 text-type-secondary text-sm ml-24 sm:ml-auto mr-3">
                    Actions
                  </div>
                </div>

                {bounties.map((b) => {
                  return (
                    <div className="flex p-4" key={b.id}>
                      <div className="flex sm:w-1/4 divide-x divide-grey-50">
                        {b.amount.length > 1 ? (
                          <div className="dropdown dropdown-top sm:dropdown-bottom">
                            <div className="w-60 sm:w-full flex">
                              <div className="flex">
                                <div className="text-xs border-2 border-grey rounded-full p-1">
                                  1+
                                </div>
                                <div className="text-sm ml-2 mt-0.5">
                                  Tokens
                                </div>
                              </div>
                              <div
                                className={
                                  "ml-4 link link-primary no-underline uppercase text-xs font-bold mt-1"
                                }
                                tabIndex="0"
                              >
                                See All
                              </div>
                            </div>
                            <div
                              tabIndex="0"
                              className="flex dropdown-content py-4 bg-grey-500 rounded-md divide-x-2 divide-grey-50 w-max ml-6 mt-2"
                            >
                              {b.amount.map((a, key) => {
                                return (
                                  <div className="flex items-center" key={key}>
                                    <img
                                      height={24}
                                      width={24}
                                      src={coingeckoId[a.denom].icon}
                                      className="ml-4"
                                    />

                                    <div className="ml-2 text-sm uppercase">
                                      {a.standardDenomName}
                                    </div>
                                    <div className="text-sm ml-2 mr-4">
                                      {a.amount.toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          b.amount.map((a, index) => {
                            return (
                              <div
                                className="flex items-center w-60 sm:w-full"
                                key={index}
                              >
                                <img
                                  height={24}
                                  width={24}
                                  src={coingeckoId[a.denom].icon}
                                  className=""
                                />

                                <div className="ml-2 text-sm mr-1 uppercase">
                                  {a.standardDenomName}
                                </div>
                                <div
                                  className="text-sm mr-4"
                                  data-test={"bounty-amount"}
                                >
                                  {a.amount.toFixed(2)}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="sm:w-1/6">
                        <div className="text-sm w-28 sm:w-0">
                          {shrinkAddress(b.creator)}
                        </div>
                      </div>
                      <div className="sm:w-1/6">
                        <div className="text-sm w-36" data-test="bounty-expiry">
                          {b.state == "BOUNTY_STATE_REVERTEDBACK" ||
                          b.state == "BOUNTY_STATE_DESTCREDITED"
                            ? "--"
                            : dayjs
                                .unix(parseInt(b.expireAt))
                                .format("MMM D, YYYY")}
                        </div>
                      </div>
                      <div className="sm:w-1/6">
                        {b.state == "BOUNTY_STATE_SRCDEBITTED" &&
                        b.expireAt > dayjs().unix() ? (
                          <div className="w-36 sm:w-0">
                            <div className="flex items-center rounded-full px-8 w-24 py-0.5 bg-purple text-xs uppercase mt-0.5">
                              Open
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {b.state == "BOUNTY_STATE_DESTCREDITED" ? (
                          <div className="w-36 sm:w-0">
                            <div className="flex items-center rounded-full px-4 w-24 py-0.5 bg-[#AD731D] text-xs uppercase mt-0.5">
                              Rewarded
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {b.expireAt < dayjs().unix() &&
                        b.state == "BOUNTY_STATE_SRCDEBITTED" ? (
                          <div className="w-36 sm:w-0">
                            <div className="flex items-center rounded-full px-7 w-24 py-0.5 bg-pink text-xs uppercase mt-0.5 ml-1">
                              Expired
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {b.state == "BOUNTY_STATE_REVERTEDBACK" ? (
                          <div className="w-36 sm:w-0">
                            <div
                              className="flex items-center rounded-full px-5 w-24 py-0.5 bg-grey text-xs uppercase mt-0.5"
                              data-test="bounty_reverted"
                            >
                              Reverted
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      {props.selectedAddress === b.creator ? (
                        b.state == "BOUNTY_STATE_SRCDEBITTED" ? (
                          <div className="flex-none flex sm:w-1/4">
                            <div
                              className={
                                "btn btn-outline btn-xs px-4" +
                                (closeBountyLoading ? " loading" : "")
                              }
                              onClick={() => {
                                props
                                  .closeBounty(
                                    apiClient,
                                    cosmosBankApiClient,
                                    cosmosFeegrantApiClient,
                                    b.id
                                  )
                                  .then(refreshBounty);
                              }}
                              data-test="bounty_close_button"
                            >
                              CLOSE
                            </div>
                            <label
                              htmlFor="my-modal-2"
                              className={"ml-2 btn btn-outline btn-xs px-4"}
                              onClick={() => {
                                setBountyId(b.id);
                              }}
                              data-test="bounty_extend_button"
                            >
                              EXTEND
                            </label>
                            <ExtendExpiry
                              updatedExpiry={updatedExpiry}
                              setUpdatedExpiry={setUpdatedExpiry}
                              bountyId={bountyId}
                              onUpdate={refreshBounty}
                            ></ExtendExpiry>
                          </div>
                        ) : (
                          ""
                        )
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
    balance: state.wallet.balance,
  };
};

export default connect(mapStateToProps, {
  updateBountyExpiry,
  closeBounty,
})(RepositoryBountiesView);
