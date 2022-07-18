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
import {
  deleteComment,
  updateIssueLabels,
  updateIssueAssignees,
} from "../../../../../store/actions/repository";
import useRepository from "../../../../../hooks/useRepository";
import IssuePullTitle from "../../../../../components/repository/issuePullTitle";
import { useErrorStatus } from "../../../../../hooks/errorHandler";
import pluralize from "../../../../../helpers/pluralize";
import IssueTabs from "../../../../../components/repository/issueTabs";
import {
  createBounty,
  updateBountyExpiry,
  closeBounty,
} from "../../../../../store/actions/bounties";

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
  const [expiry, setExpiry] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validateAmountError, setValidateAmountError] = useState("");

  function isNaturalNumber(n) {
    n = n.toString();
    var n1 = Math.abs(n),
      n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  const validateAmount = async (amount) => {
    setValidateAmountError(null);
    let Vamount = Number(amount);
    if (amount == "" || amount == 0) {
      setValidateAmountError("Enter Valid Amount");
    }

    let balance = props.loreBalance;
    if (props.advanceUser === false) {
      Vamount = Vamount * 1000000;
    }
    if (Vamount > 0 && isNaturalNumber(Vamount)) {
      if (Vamount < 10 || Vamount > 0) {
        if (Vamount > balance) {
          setValidateAmountError("Insufficient Balance");
        }
      } else {
        setValidateAmountError("Amount should be in range 1-10");
      }
    } else {
      setValidateAmountError("Enter a Valid Amount");
    }
  };

  useEffect(async () => {
    console.log(router.query.userId);
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
    console.log(repository);
    setAllLabels(repository.labels);
    console.log(i);
  }, [router.query.issueIid, repository.id]);

  const refreshIssue = async () => {
    const i = await getRepositoryIssue(
      repository.owner.id,
      repository.name,
      issue.iid
    );
    setIssue(i);
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
          {console.log("issue", issue, issue.iid, issue.id)}
          <IssueTabs
            repository={repository}
            issueId={issue.iid}
            active="bounties"
          />
          <div className="mt-8">
            <div className="flex">
              <div className="">Title goes here</div>
              <label
                className="ml-auto btn btn-primary text-xs btn-sm modal-button"
                htmlFor="my-modal-2"
              >
                NEW BOUNTY
              </label>
              <input type="checkbox" id="my-modal-2" className="modal-toggle" />
              <label htmlFor="my-modal-2" className="modal cursor-pointer">
                <label className="modal-box relative">
                  <div className="flex mb-4">
                    <div className="w-11/12 font-bold text-sm text-type">
                      Add bounty
                    </div>
                    <label
                      htmlFor="my-modal-2"
                      className="ml-auto hover:opacity-25"
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
                  </div>

                  <div class="card w-full bg-grey-900 shadow-xl mt-4">
                    <div class="card-body p-3">
                      <div className="mb-2 text-grey-200">AMOUNT</div>
                      <div className="flex mb-2">
                        <div>
                          <input
                            class="appearance-none bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none text-2xl font-bold"
                            type="text"
                            placeholder="Enter Amount"
                            aria-label="Full name"
                            onKeyUp={async (e) => {
                              await validateAmount(e.target.value);
                            }}
                            onChange={(e) => {
                              setAmount(e.target.value);
                            }}
                          ></input>
                          {validateAmountError ? (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {validateAmountError}
                              </span>
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                        <select className="select w-fit max-w-xs ml-auto h-10">
                          <option disabled selected>
                            Select Token
                          </option>
                          <option>
                            {props.advanceUser === true
                              ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
                              : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
                          </option>
                        </select>
                      </div>
                      <div className="flex ml-auto text-grey-200">
                        <div className="text-xs mr-1">Balance:</div>
                        <div className="text-xs mr-2">
                          {props.advanceUser === true
                            ? props.loreBalance
                            : props.loreBalance / 1000000}
                        </div>
                        <div className="link link-primary text-xs text-primary font-bold no-underline">
                          Max
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card w-full bg-grey-900 shadow-xl mt-3">
                    <div class="card-body p-3">
                      <div className="flex">
                        <div className="">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 2V5"
                              stroke="#E5EDF5"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M8 2V5"
                              stroke="#E5EDF5"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                            <path
                              d="M3 7.5C3 6.43913 3.42143 5.42172 4.17157 4.67157C4.92172 3.92143 5.93913 3.5 7 3.5H17C18.0609 3.5 19.0783 3.92143 19.8284 4.67157C20.5786 5.42172 21 6.43913 21 7.5V18C21 19.0609 20.5786 20.0783 19.8284 20.8284C19.0783 21.5786 18.0609 22 17 22H7C5.93913 22 4.92172 21.5786 4.17157 20.8284C3.42143 20.0783 3 19.0609 3 18V7.5Z"
                              stroke="#E5EDF5"
                              stroke-width="1.5"
                            />
                            <path
                              d="M3 9H21"
                              stroke="#E5EDF5"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            />
                          </svg>
                        </div>
                        <div className="flex text-xs mt-1 ml-1.5">
                          Expiry date
                        </div>
                        <div className="flex ml-auto text-grey-200 text-xs">
                          {dayjs().format("DD MMMM YYYY")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex ml-auto self-center">
                    <div className="modal-action">
                      <label
                        htmlFor="my-modal-2"
                        className="btn w-96 px-56 flex-1 bg-green-900 text-xs ml-1"
                        onClick={(e) => {
                          props.createBounty(
                            "2",
                            dayjs("2019-01-25").unix(),
                            2,
                            "issue"
                          );
                        }}
                        disabled={null}
                      >
                        ADD
                      </label>
                    </div>
                  </div>
                </label>
              </label>
            </div>
            <div className="border border-gray-700 rounded mt-4 text-justify divide-y divide-gray-700">
              <div className="flex mt-2 mb-2">
                <div className="w-1/4">
                  <div className="text-type-secondary text-sm ml-3">Amount</div>
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
              <div className="flex mt-2  mb-3 pt-3">
                <div className="w-1/4 flex">
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
                  <div className="text-sm mr-1">Tlore</div>
                  <div className="text-sm">12.456788</div>
                </div>

                <div className="w-1/6">
                  <div className="text-sm">abxasd...12xX...</div>
                </div>
                <div className="w-1/6">
                  <div className="text-sm">07 July 2022</div>
                </div>
                <div className="w-1/6">
                  <div className="flex items-center rounded-full px-8 w-24 py-0.5 bg-purple text-xs uppercase">
                    Open
                  </div>
                </div>
              </div>
              <div className="flex mt-2 mb-3 pt-3">
                <div className="w-1/4 flex">
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
                  <div className="text-sm mr-1">Tlore</div>
                  <div className="text-sm">12.456788</div>
                </div>

                <div className="w-1/6">
                  <div className="text-sm">abxasd...12xX...</div>
                </div>
                <div className="w-1/6">
                  <div className="text-sm">07 July 2022</div>
                </div>
                <div className="w-1/6">
                  <div className="flex items-center rounded-full px-7 w-24 py-0.5 bg-pink text-xs uppercase">
                    Expired
                  </div>
                </div>

                <div className="flex ml-auto mr-3">
                  <div
                    className="bg-transparent hover:bg-green py-1 px-3 border border-primary hover:border-transparent rounded text-xs hover:cursor-pointer"
                    onClick={(e) => {
                      props.closeBounty(4);
                    }}
                  >
                    CLOSE BOUNTY
                  </div>

                  <div
                    className="ml-2 bg-transparent hover:bg-green py-1 px-3 border border-primary hover:border-transparent rounded text-xs hover:cursor-pointer"
                    onClick={(e) => {
                      props.updateBountyExpiry(4, dayjs("2019-02-25").unix());
                    }}
                  >
                    EXTEND EXPIRY
                  </div>
                </div>
              </div>
              <div className="flex mt-2 mb-3 pt-3">
                <div className="w-1/4 flex">
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
                  <div className="text-sm mr-1">Tlore</div>
                  <div className="text-sm">12.456788</div>
                </div>

                <div className="w-1/6">
                  <div className="text-sm">abxasd...12xX...</div>
                </div>
                <div className="w-1/6">
                  <div className="text-sm">07 July 2022</div>
                </div>
                <div className="w-1/6">
                  <div className="flex items-center rounded-full px-4 w-24 py-0.5 bg-teal text-xs uppercase">
                    Rewarded
                  </div>
                </div>
              </div>
              <div className="flex mt-2 mb-3 pt-3">
                <div className="w-1/4 flex">
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
                  <div className="text-sm mr-1">Tlore</div>
                  <div className="text-sm">12.456788</div>
                </div>

                <div className="w-1/6">
                  <div className="text-sm">abxasd...12xX...</div>
                </div>
                <div className="w-1/6">
                  <div className="text-sm">07 July 2022</div>
                </div>
                <div className="w-1/6">
                  <div className="flex items-center rounded-full px-4 w-24 py-0.5 bg-teal text-xs uppercase">
                    Rewarded
                  </div>
                </div>
              </div>
            </div>
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
  deleteComment,
  updateIssueAssignees,
  updateIssueLabels,
  createBounty,
  updateBountyExpiry,
  closeBounty,
})(RepositoryIssueView);
