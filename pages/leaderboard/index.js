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

    const currentUserBounty = props.user.address
      ? rewardMap[props.user.address]
      : { count: 0, total: 0 };

    setCurrentUserBounty(currentUserBounty);
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

      <div className="flex h-screen flex-col">
        <div className="items-center justify-center py-12 lg:mx-auto lg:max-w-screen-lg lg:px-4">
          <div className={`sm:flex ${styles.midScreen}`} id="home">
            <div className={`mb-8 ${styles.flexColItemsStart} sm:flex-row`}>
              <div className="">
                <AccountAvatar user={props.user} isEditable={false} />
                <div className="grid justify-items-center">
                  <UserUsername user={props.user} isEditable={false} />
                </div>
                <div className="grid justify-items-center">
                  <div className="text-center">
                    <p>Total Bounties: {currentUserBounty.count}</p>
                    <p>
                      Total Value: {showToken(currentUserBounty.total, token)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.midScreenImage}>
              <img src="/leaderboard/home.svg" alt="Leaderboard" />
            </div>
          </div>
        </div>
      </div>
      <table className="table min-h-fit sm:w-full">
        <thead>
          <tr>
            <th>User</th>
            <th className="w-36">Name</th>
            <th className="w-56">Bounties claimed</th>
            <th className="w-56">Total Reward</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={"member" + index}>
              <td className="text-sm">
                <AccountCard id={user.address} showAvatar={true} />
              </td>
              <td>{usernames[user.address]}</td>
              <td>{user.count}</td>
              <td>{showToken(user.total, token)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
