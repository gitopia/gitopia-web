import { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "../../styles/leaderboard/homepage.module.css";
import Head from "next/head";
import Header from "../../components/header";
import AccountCard from "../../components/account/card";
import AccountAvatar from "../../components/account/avatar";
import UserUsername from "../../components/user/username";
import Footer from "../../components/landingPageFooter";
import showToken from "../../helpers/showToken";
import { useQuery, gql } from "@apollo/client";
import client from "../../helpers/apolloClient";

const GET_USERS = gql`
  query GetUsers($addresses: [String!]) {
    users(where: { address_in: $addresses }) {
      id
      username
      name
    }
  }
`;

function Leaderboard(props) {
  const [currentUserBounty, setCurrentUserBounty] = useState({
    count: 0,
    total: 0,
  });
  const [currentUserRank, setCurrentUserRank] = useState("-");
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(process.env.NEXT_PUBLIC_CURRENCY_TOKEN);
  const [usernames, setUsernames] = useState({});

  const fetchBounties = async (key = "") => {
    let url = "https://api.gitopia.com/gitopia/gitopia/gitopia/bounty";
    if (key) {
      url += `?pagination.key=${key}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const aggregateData = async () => {
    let nextKey = "";
    let allBounties = [];
    do {
      const data = await fetchBounties(nextKey);
      allBounties = allBounties.concat(data.Bounty);
      nextKey = data.pagination.next_key;
    } while (nextKey);

    // Process the data: aggregate total rewards and count bounties per `rewardedTo`
    const verifiedRepositoryIds = ["5", "6", "7"];
    const rewardMap = allBounties.reduce((acc, bounty) => {
      if (
        bounty.rewardedTo &&
        verifiedRepositoryIds.includes(bounty.repositoryId)
      ) {
        // verified repository
        if (!acc[bounty.rewardedTo]) {
          acc[bounty.rewardedTo] = { total: 0, count: 0 };
        }
        acc[bounty.rewardedTo].total += parseInt(bounty.amount[0].amount);
        acc[bounty.rewardedTo].count += 1;
      }
      return acc;
    }, {});

    const sortedUsers = Object.entries(rewardMap)
      .map(([address, data]) => ({
        address,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total);

    const rankedUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    const currentUserBounty = props.user.address
      ? rewardMap[props.user.address]
      : { count: 0, total: 0 };

    const currentUserRank = props.user.address
      ? rankedUsers.find((user) => user.address === props.user.address)?.rank ||
        "-"
      : "-";

    setCurrentUserBounty(currentUserBounty);
    setCurrentUserRank(currentUserRank);
    setUsers(sortedUsers);
  };

  useEffect(() => {
    aggregateData();
  }, [props.user]);

  // Extract user addresses from your users state to pass into the GraphQL query
  const addresses = users.map((user) => user.address);

  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { addresses },
    client: client,
  });

  useEffect(() => {
    if (data && data.users) {
      const usernameMap = data.users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});
      setUsernames(usernameMap);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={"relative mt-12 flex flex-col items-center lg:mt-16"}>
        <div className="w-full max-w-screen-lg items-center">
          <div className="p-4 pt-8 lg:p-0">
            <div className="text-4xl font-bold tracking-tight lg:text-center lg:text-5xl">
              Leaderboard
            </div>
          </div>
          <div className="border-grey-50 bg-base-200/70 relative mx-4 mt-12 max-w-2xl rounded-xl border text-sm lg:mx-auto lg:mt-16">
            <div className="bg-base-200 border-grey-50 absolute -top-3 left-1/2 -ml-12 rounded-full border px-4 py-1 text-xs font-bold uppercase text-purple-50">
              Bounties
            </div>
            <div className="flex flex-col justify-evenly gap-8 p-8 pt-10 lg:flex-row">
              <div className="grid justify-items-center">
                <AccountAvatar user={props.user} isEditable={false} />
                <div className="grid justify-items-center">
                  <UserUsername user={props.user} isEditable={false} />
                </div>
              </div>
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
                  <span className="text-type-secondary font-bold">Rank</span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Based on total rewards"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-4xl uppercase">{currentUserRank}</span>
                </div>
              </div>
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
                  <span className="text-type-secondary font-bold">Total</span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Total bounties claimed by you"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-4xl uppercase">
                    {currentUserBounty.count}
                  </span>
                </div>
              </div>
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
                  <span className="text-type-secondary font-bold">Reward</span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Total rewards received from bounties"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                <div className="my-2">
                  <span className="text-4xl uppercase">
                    {showToken(currentUserBounty.total, token)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <table className="table mt-12 lg:mt-16">
          <thead>
            <tr>
              <th className="text-base">Rank</th>
              <th className="text-base">User</th>
              <th className="text-base w-36">Name</th>
              <th className="text-base w-56">Bounties</th>
              <th className="text-base w-56">Reward</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={"member" + index}>
                <td className="text-base">{index + 1}</td>
                <td className="text-base">
                  <AccountCard id={user.address} showAvatar={true} />
                </td>
                <td className="text-base">{usernames[user.address]}</td>
                <td className="text-base">{user.count}</td>
                <td className="tooltip mt-3.5 cursor-default rounded-full border px-2 py-px text-base uppercase border-transparent bg-[#AD731D]">
                  {showToken(user.total, token)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <img
          className={
            "pointer-events-none absolute bottom-2/3 right-10 -z-10 w-3/4 opacity-50 sm:mb-14"
          }
          src="/rewards/objects.svg"
        />
        <img
          className={
            "pointer-events-none absolute bottom-1/3 -z-20 mb-96 w-full opacity-50 lg:mb-48 2xl:mb-10"
          }
          src="/rewards/ellipse.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-2/3 -z-20 w-full opacity-50 sm:visible lg:bottom-1/3 lg:mb-48"
          }
          src="/rewards/stars-3.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-3/4 left-5 -z-20 mt-20 opacity-30 lg:visible"
          }
          src="/rewards/coin-1.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute -top-36 right-0 -z-20 opacity-30 sm:visible lg:-top-20"
          }
          src="/rewards/coin-2.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-2/3 left-36 -z-20 opacity-30 lg:visible"
          }
          src="/rewards/coin-3.png"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-1/2 right-36 -z-20 mb-28 opacity-30 lg:visible"
          }
          src="/rewards/coin-4.svg"
        />
      </section>

      <Footer />
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(Leaderboard);
