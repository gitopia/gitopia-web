import Head from "next/head";
import Header from "../../components/header";
import { connect } from "react-redux";
import Footer from "../../components/footer";
import AccountGrants from "../../components/account/grants";
import Link from "next/link";

export async function getStaticProps() {
  return { props: {} };
}

function AccountView(props) {
  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Account Settings</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <div className="flex">
            <div className="avatar flex-none items-center">
              <div
                className={"w-16 h-16 rounded-full border border-transparent"}
              >
                <img
                  src={
                    props.user.avatarUrl == ""
                      ? "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                        props.user.username.slice(-1)
                      : props.user.avatarUrl
                  }
                />
              </div>
            </div>
            <div className="pl-4">
              <div className="text-2xl mb-1">{props.user.name}</div>
              <div className="">{props.user.username}</div>
            </div>
            <div className="flex-1"></div>
            <div className="">
              <Link
                href={"/" + props.user.username}
                className="btn btn-xs btn-outline"
              >
                View Profile
              </Link>
            </div>
          </div>
          <div className="sm:flex mt-8">
            <div className="flex-none w-64">
              <ul className="menu p-4 rounded-md">
                <li>
                  <a className="rounded selected" href="#authorizations">
                    Authorizations
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-1 px-6">
              <div className="divide-y divide-grey">
                <div
                  className="text-lg sm:text-2xl py-4 sm:py-6"
                  id="authorizations"
                >
                  Authorizations
                </div>

                <AccountGrants address={props.selectedAddress} />
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
    currentDashboard: state.user.currentDashboard,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(AccountView);
