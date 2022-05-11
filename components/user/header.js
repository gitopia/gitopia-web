import shrinkAddress from "../../helpers/shrinkAddress";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import { updateUserBio, updateUserAvatar } from "../../store/actions/user";
import { notify } from "reapop";
import getUser from "../../helpers/getUser";
import { useEffect } from "react";
import TextInput from "../textInput";
function UserHeader(props) {
  const [validateImageUrlError, setValidateImageUrlError] = useState("");
  const [imageUrl, setImageUrl] = useState(0);
  const name = props.user.creator ? props.user.creator : "u";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    creator: "",
    repositories: [],
    organizations: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newBioHint, setNewBioHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    setNewBio(user.bio);
    setNewBioHint({ shown: false });
  }, [user]);

  const validateBio = (bio) => {
    setNewBioHint({
      ...newBioHint,
      shown: false,
    });

    if (bio === user.bio) {
      setNewBioHint({
        shown: true,
        type: "error",
        message: "Bio is same as earlier",
      });
      return false;
    }
    return true;
  };

  const updateBio = async () => {
    setSavingBio(true);
    if (validateBio(newBio)) {
      await props.updateUserBio({
        bio: newBio,
      });

      if (res && res.code === 0) {
        if (refreshBio) await refreshBio(newBio);
        setIsEditing(false);
      } else {
        if (onError) onError();
      }
    }
    setSavingBio(false);
  };
  useEffect(async () => {
    console.log(router.query.userId);
    const u = await getUser(router.query.userId);
    if (u) {
      setUser(u);
    } else {
      setErrorStatusCode(404);
    }
  }, [router.query.userId]);
  const validateImageUrl = async (url) => {
    setValidateImageUrlError(null);
    var image = new Image();
    image.onload = function () {
      if (this.width > 0) {
        setValidateImageUrlError(null);
      }
    };
    image.onerror = function () {
      setValidateImageUrlError("image doesn't exist");
    };
    image.src = url;
  };
  const refreshBio = async () => {
    const u = await getUser(router.query.userId);
    if (u) {
      setUser(u);
    } else {
      setErrorStatusCode(404);
    }
  };
  return (
    <div className="flex flex-1 mb-8">
      <div>
        <div className="indicator">
          <input
            type="checkbox"
            id="avatar-url-modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box relative">
              <label
                htmlFor="avatar-url-modal"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <div>
                <label className="label">
                  <span className="label-text text-xs font-bold text-gray-400">
                    IMAGE URL
                  </span>
                </label>
                <div>
                  <input
                    name="Image Url"
                    placeholder="Enter Url"
                    autoComplete="off"
                    onKeyUp={async (e) => {
                      await validateImageUrl(e.target.value);
                    }}
                    onMouseUp={async (e) => {
                      await validateImageUrl(e.target.value);
                    }}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                    }}
                    className="w-full h-11 input input-xs input-ghost input-bordered "
                  />
                </div>
                {validateImageUrlError ? (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {validateImageUrlError}
                    </span>
                  </label>
                ) : (
                  ""
                )}
              </div>
              <div className="modal-action ml-auto w-28">
                <label
                  htmlFor="avatar-url-modal"
                  className={"btn btn-sm btn-primary btn-outline btn-block "}
                  onClick={async (e) => {
                    console.log("click");
                    setLoading(true);
                    const res = await props.updateUserAvatar();
                    if (res && res.code === 0) {
                      props.notify("Your user avatar is updated", "info");
                    }
                    console.log(res);
                    setLoading(false);
                  }}
                  disabled={validateImageUrlError !== null}
                >
                  UPDATE
                </label>
              </div>
            </div>
          </div>
          {router.query.userId == props.selectedAddress ? (
            <label htmlFor="avatar-url-modal" className="modal-button">
              <div className="indicator-item indicator-bottom mr-14 mb-6 h-7.5 w-7.5 bg-grey rounded-full p-1 border border-black">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 20V18C19 16.3431 17.6569 15 16 15H8C6.34315 15 5 16.3431 5 18V20"
                    stroke="#66CE67"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="8"
                    r="3"
                    stroke="#66CE67"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </label>
          ) : (
            ""
          )}
          <div className="avatar flex-none mr-8 items-center">
            <div className={"w-40 h-40 rounded-full"}>
              <img
                src={
                  user.avatarUrl == ""
                    ? "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                      name.slice(-1)
                    : user.avatarUrl
                }
              />
            </div>
          </div>
        </div>
        <div className="mx-8 text-type-secondary text-lg mt-1">
          <p>{shrinkAddress(user.creator)}</p>
        </div>
      </div>
      <div className="flex flex-1 text-type text-md items-center">
        <div className="pl-12">
          <div className="text-2xl">About</div>
          {/*<div
            className={
              "h-16 w-96 pr-5 pt-4 text-sm" +
              (user.bio == "" ? " text-grey italic" : " text-grey-100")
            }
          >
            {user.bio == "" ? "No Bio Provided" : user.bio}
          </div>*/}
          <div className="flex-1 h-20 w-96 pr-20 mr-10">
            {isEditing ? (
              <TextInput
                type="text"
                name="bio"
                placeholder="Bio"
                multiline={true}
                value={newBio}
                setValue={setNewBio}
                hint={newBioHint}
                size="sm"
              />
            ) : (
              <div>
                <span
                  className={
                    "h-16 w-96 pr-5 pt-4 text-sm" +
                    (user.bio == "" ? " text-grey italic" : " text-grey-100")
                  }
                >
                  {" "}
                  {user.bio == "" ? "No Bio Provided" : user.bio}
                </span>
              </div>
            )}
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
        {/*router.query.userId == props.selectedAddress ? (
          <div className="text-xs font-bold uppercase no-underline text-primary mt-20">
            EDIT PROFILE
          </div>
        ) : (
          ""
        )*/}
        {isEditing ? (
          <div className="flex flex-none w-60 btn-group ml-1">
            <button
              className="flex-1 btn btn-sm mt-20 text-xs "
              onClick={() => {
                setIsEditing(false);
                setNewBio(user.bio);
                setNewBioHint({ shown: false });
              }}
            >
              Cancel
            </button>
            <button
              className={
                "flex-1 btn btn-sm btn-primary mt-20 text-xs " +
                (savingBio ? "loading" : "")
              }
              onClick={updateBio}
              disabled={savingBio}
            >
              Save
            </button>
          </div>
        ) : (
          <>
            {user.creator === props.selectedAddress ? (
              <button
                className="btn btn-sm btn-ghost text-xs font-bold uppercase no-underline text-primary mt-20"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                EDIT PROFILE
              </button>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateUserAvatar,
  updateUserBio,
  notify,
})(UserHeader);
