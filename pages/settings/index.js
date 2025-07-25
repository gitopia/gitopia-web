import Head from "next/head";
import Header from "../../components/header";
import { connect } from "react-redux";
import Footer from "../../components/footer";
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
              <Link
                href={"/" + props.user.username}
                className="link link-primary text-2xl no-underline"
              >
                {props.user.name ? props.user.name : props.user.username}
              </Link>
              <div className="">{props.user.creator}</div>
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
