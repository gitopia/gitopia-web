import { connect } from "react-redux";
import Link from "next/link";

function GreetUser(props) {
  return props.selectedAddress ? (
    <div>
      {props.user.username ? (
        <div className="flex">
          <div className="text-xl ml-4">
            <Link href={"/" + props.user.username} className="link link-primary no-underline">
              {props.user.name ? props.user.name : props.user.username}
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {props.user.creator ? (
            <div>
              <div className="bg-box-grad-tl bg-base-200 p-4 rounded-md">
                <div>
                    <div className="text-lg">Claim your username</div>
                    <div className="text-xs mt-2 text-type-secondary">
                      Your profile has been upgraded, now username can be used
                      to refer your repositories
                    </div>
                </div>
                <div className="mt-4">
                  <Link
                    href={"/" + props.selectedAddress}
                    className="btn btn-accent btn-wide btn-sm"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-box-grad-tl bg-base-200 p-4 rounded-md">
                <div>
                    <div className="text-lg">Create your profile</div>
                    <div className="text-xs mt-2 text-type-secondary">
                      A profile is required to publish and interact with Gitopia
                      repositories
                    </div>
                </div>
                <div className="mt-4">
                  <Link
                    href={"/login?step=6"}
                    className="btn btn-primary btn-wide btn-sm"
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
