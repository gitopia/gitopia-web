import shrinkAddress from "../../helpers/shrinkAddress";
import Link from "next/link";

export default function UserHeader({ user }) {
  return (
    <div className="flex flex-1 mb-8">
      <div className="avatar flex-none mr-8 items-center">
        <div className={"w-14 h-14 rounded-full"}>
          <img
            src={
              "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
              user.creator
            }
          />
        </div>
      </div>
      <div className="flex flex-1 text-primary text-md items-center">
        <div>
          <div className="flex">
            <p>{user.creator}</p>
          </div>
          <div className="flex mt-2">
            <div className="text-type-secondary text-xs font-semibold flex">
              {user.followers == undefined ? "0" : user.followers.length}{" "}
              followers
            </div>
            <div className="ml-6 text-type-secondary text-xs font-semibold flex">
              {user.following == undefined ? "0" : user.following.length}{" "}
              following
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}