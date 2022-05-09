import shrinkAddress from "../../helpers/shrinkAddress";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
function UserHeader(props) {
  const [validateImageUrlError, setValidateImageUrlError] = useState("");
  const [imageUrl, setImageUrl] = useState(0);
  const name = props.user.creator ? props.user.creator : "u";
  const router = useRouter();
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
                  className="btn btn-sm btn-primary flex-1 bg-green-900"
                  onClick={(e) => {}}
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
                  props.user.avatarUrl == ""
                    ? "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                      name.slice(-1)
                    : props.user.avatarUrl
                }
              />
            </div>
          </div>
        </div>
        <div className="mx-8 text-type-secondary text-lg mt-1">
          <p>{shrinkAddress(props.user.creator)}</p>
        </div>
      </div>
      <div className="flex flex-1 text-type text-md items-center">
        <div className="pl-12">
          <div className="text-2xl">About</div>
          <div
            className={
              "h-16 w-96 pr-5 pt-4 text-sm" +
              (props.user.bio == "" ? " text-grey italic" : " text-grey-100")
            }
          >
            {props.user.bio == "" ? "No Bio Provided" : props.user.bio}
          </div>
          <div className="flex mt-10">
            <div className="text-type-secondary text-xs font-semibold flex">
              {props.user.followers == undefined
                ? "0"
                : props.user.followers.length}{" "}
              followers
            </div>
            <div className="ml-6 text-type-secondary text-xs font-semibold flex">
              {props.user.following == undefined
                ? "0"
                : props.user.following.length}{" "}
              following
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 mr-40">
        <div className="text-lg">DAOs</div>
        <div className="flex mt-4">
          {props.user.organizations.length > 0 ? (
            props.user.organizations.map((dao) => {
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
        {router.query.userId == props.selectedAddress ? (
          <div className="text-xs font-bold uppercase no-underline text-primary mt-20">
            EDIT PROFILE
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {})(UserHeader);
