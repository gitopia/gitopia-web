import shrinkAddress from "../../helpers/shrinkAddress";
export default function UserHeader({ user }) {
  const name = user.creator ? user.creator : "u";
  return (
    <div className="flex flex-1 mb-8">
      <div>
        <div className="avatar flex-none mr-8 items-center">
          <div className={"w-40 h-40 rounded-full"}>
            <img
              src={
                "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                name.slice(-1)
              }
            />
          </div>
        </div>
        <div className="mx-8 text-type-secondary text-lg mt-1">
          <p>{shrinkAddress(user.creator)}</p>
        </div>
      </div>
      <div className="flex flex-1 text-type text-md items-center">
        <div className="pl-12">
          <div className="text-2xl">About</div>
          <div className="w-96 pr-5 pt-4 text-sm">
            I’m a crazy developer with a love for Blockchain and butter chicken.
            I enjoy coding in Vue.JS, Javascript and every other language on the
            planet.
          </div>
          <div className="flex mt-10">
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
      <div className="mt-5 mr-40">
        <div className="text-lg">DAOs</div>
        <div className="flex mt-4">
          {user.organizations.length > 0 ? (
            user.organizations.map((dao) => {
              console.log(dao);
              return (
                <div className="flex" key={dao.id}>
                  <div className="avatar flex-none mr-2 items-center">
                    <div className={"w-8 h-8 rounded-full"}>
                      <img
                        src={
                          "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                          dao.name.slice(0)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-type-secondary text-xs font-semibold">---</div>
          )}
        </div>
        <div className="text-xs font-bold uppercase no-underline text-primary mt-20">
          EDIT PROFILE
        </div>
      </div>
    </div>
  );
}
