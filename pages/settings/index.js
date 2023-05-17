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
            <div className="avatar">
              <div className="rounded-full w-16 h-16">
                {props.user?.avatarUrl ? (
                  <img src={props.user.avatarUrl} />
                ) : (
                  <span className="bg-purple-900 flex items-center justify-center text-4xl uppercase h-full text-white pointer-events-none">
                    {props.user?.name
                      ? props.user.name[0]
                      : props.user?.username
                      ? props.user.username?.[0]
                      : "."}
                  </span>
                )}
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
