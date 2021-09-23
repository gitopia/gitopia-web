import Link from "next/link";
import { connect } from "react-redux";
import getHomeUrl from "../helpers/getHomeUrl";

function SimpleHeader(props) {
  const headerMessage = process.env.NEXT_PUBLIC_HEADER_MESSAGE;
  return (
    <>
      {headerMessage && headerMessage !== "" ? (
        <div className="flex bg-purple-900 justify-center items-center text-xs p-1 text-purple-50">
          <span>{headerMessage}</span>
        </div>
      ) : (
        ""
      )}
      <div className="navbar bg-base-100 text-base-content">
        <div className="container mx-auto py-7">
          <div className="flex-none">
            <Link href={getHomeUrl(props.dashboards, props.currentDashboard)}>
              <img
                width={110}
                height={30}
                src="/logo-white.svg"
                className="cursor-pointer"
              ></img>
            </Link>
          </div>
          <div className="flex-1"></div>
          <div className="items-stretch">
            <a className="btn btn-ghost btn-sm rounded-btn">Login</a>
            <a className="btn btn-ghost btn-sm rounded-btn">Contact Us</a>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
  };
};

export default connect(mapStateToProps, {})(SimpleHeader);
