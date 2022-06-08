import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  createUser,
  getUserDetailsForSelectedAddress,
} from "../store/actions/user";
import Link from "next/link";
import { notify } from "reapop";

function CreateUser(props) {
  const [loading, setLoading] = useState(false);
  const [userCreated, setUserCreated] = useState(props.user.creator);

  useEffect(() => {
    setUserCreated(props.user.creator);
  }, [props.user]);

  return (
    <div className="mt-4 sm:flex mb-4 bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
      <div className="flex">
        <div
          className={
            "w-14 h-14 flex-none mr-5 sm:mr-10 flex justify-center items-center rounded-full border" +
            (userCreated ? " border-green bg-green-900" : " border-grey")
          }
        >
          {userCreated ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          )}
        </div>
        <div className="sm:flex-1">
          <div className="text-lg">Create your on-chain profile </div>
          <div className="text-xs mt-2 text-type-secondary">
            Your profile is required to interact with Gitopia chain and
            collaborate with other people
          </div>
        </div>
      </div>
      <div className="flex-none w-60 mr-8 mt-4 sm:mt-0">
        {userCreated ? (
          <Link href={"/" + props.selectedAddress}>
            <a className={"btn btn-sm btn-primary btn-outline btn-block "}>
              View Profile
            </a>
          </Link>
        ) : (
          <button
            className={
              "btn btn-sm btn-primary btn-outline btn-block " +
              (loading ? "loading" : "")
            }
            onClick={async () => {
              setLoading(true);
              const res = await props.createUser();
              if (res && res.code === 0) {
                await props.getUserDetailsForSelectedAddress();
                props.notify("Your profile is created", "info");
              }
              console.log(res);
              setLoading(false);
            }}
            disabled={loading}
          >
            Create Profile
          </button>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  createUser,
  getUserDetailsForSelectedAddress,
  notify,
})(CreateUser);
