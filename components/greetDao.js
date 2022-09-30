import { connect } from "react-redux";
import Link from "next/link";

function GreetDao({ dao, ...props }) {
  let isDaoTemp = new RegExp(/^temp-/);
  return (
    <div>
      {isDaoTemp.test(dao.name) ? (
        <div>
          <div className="sm:flex bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
            <div className="flex">
              <div
                className={
                  "w-14 h-14 flex-none mr-5 sm:mr-10 flex justify-center items-center rounded-full border border-accent bg-accent"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>

              <div className="flex-1 mr-8">
                <div className="text-lg">Update your DAO</div>
                <div className="text-xs mt-2 text-type-secondary">
                  This DAO profile has been migrated, please update the name
                  {" (remove temp-)"}
                </div>
              </div>
            </div>
            <div className="flex-none w-60 mr-8 mt-4 sm:mt-0">
              <Link href={"/" + dao.address}>
                <a className="btn btn-accent btn-block btn-sm">
                  Update DAO Name
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xs uppercase">Welcome to</div>
          <Link href={"/" + dao.name}>
            <a className="text-lg btn-link">{dao.name}</a>
          </Link>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(GreetDao);
