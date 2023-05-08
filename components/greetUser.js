import { connect } from "react-redux";
import Link from "next/link";

function GreetUser(props) {
  return props.selectedAddress ? (
    <div>
      {props.user.username ? (
        <div>
          <div className="text-xs">Welcome</div>
          <div className="text-lg">
            <Link href={"/" + props.user.username} className="btn-link">
              {props.user.name ? props.user.name : props.user.username}
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {props.user.creator ? (
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
                    <div className="text-lg">Claim your username</div>
                    <div className="text-xs mt-2 text-type-secondary">
                      Your profile has been upgraded, now username can be used
                      to refer your repositories
                    </div>
                  </div>
                </div>
                <div className="flex-none w-60 mr-8 mt-4 sm:mt-0">
                  <Link
                    href={"/" + props.selectedAddress}
                    className="btn btn-accent btn-block btn-sm"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="sm:flex bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
                <div className="flex">
                  <div
                    className={
                      "w-14 h-14 flex-none mr-5 sm:mr-10 flex justify-center items-center rounded-full border border-grey"
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
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>

                  <div className="flex-1 mr-8">
                    <div className="text-lg">Create your profile</div>
                    <div className="text-xs mt-2 text-type-secondary">
                      A profile is required to publish and interact with Gitopia
                      repositories
                    </div>
                  </div>
                </div>
                <div className="flex-none w-60 mr-8 mt-4 sm:mt-0">
                  <Link
                    href={"/login?step=6"}
                    className="btn btn-primary btn-block btn-sm"
                  >
                    Create Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <div></div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(GreetUser);
