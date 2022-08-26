import { useState } from "react";
import { connect } from "react-redux";
import { updateDaoAvatar } from "../../store/actions/dao";
import { notify } from "reapop";

function OrgAvatar(props = { isEditable: false }) {
  const name = props.org.name ? props.org.name : ".";
  const [validateImageUrlError, setValidateImageUrlError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(
    "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=0&name=.&background=2d3845"
  );
  const [previewAvatarText, setPreviewAvatarText] =
    useState("Nothing to Preview");

  const validateImageUrl = async (url) => {
    if (url == "") {
      setValidateImageUrlError(null);
      setPreviewAvatarText("Nothing to Preview");
      setPreviewAvatarUrl(
        "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=0&caps=1&name=.&background=2d3845"
      );
      return;
    }
    setValidateImageUrlError(null);
    setPreviewLoading(true);
    setPreviewAvatarText("Loading...");
    setPreviewAvatarUrl(
      "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=0&caps=1&name=.&background=2d3845"
    );
    var image = new Image();
    image.onload = function () {
      if (this.width > 0) {
        setPreviewLoading(false);
        setValidateImageUrlError(null);
        setPreviewAvatarText("");
        setPreviewAvatarUrl(imageUrl);
      }
    };
    image.onerror = function () {
      setPreviewLoading(false);
      setValidateImageUrlError("image doesn't exist");
      setPreviewAvatarText("");
      setPreviewAvatarUrl(
        "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=!&background=2d3845&color=6F7A8F"
      );
    };
    image.src = url;
  };

  return (
    <div>
      <div className="indicator">
        <input type="checkbox" id="avatar-url-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="avatar-url-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>

            <div className="avatar flex-none mr-8 items-center mx-36">
              <div className={"relative w-40 h-40 rounded-full"}>
                <img src={previewAvatarUrl} />
                <div className="absolute w-full bottom-16 text-center italic text-grey-300 text-sm">
                  {previewAvatarText}
                </div>
              </div>
            </div>
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
                  value={imageUrl}
                  onKeyUp={async (e) => {
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
              {previewLoading ? (
                <label className="label">
                  <span className="label-text-alt text-amber-300">
                    checking avatar url...
                  </span>
                </label>
              ) : (
                ""
              )}
            </div>
            <div className="modal-action ml-auto w-28">
              <label
                htmlFor="avatar-url-modal"
                className={
                  "btn btn-sm btn-primary btn-block " +
                  (loading ? "loading" : "")
                }
                onClick={async (e) => {
                  if (props.callback) {
                    props.callback(imageUrl);
                  } else {
                    setLoading(true);
                    const res = await props.updateDaoAvatar({
                      id: props.org.address,
                      url: imageUrl,
                    });
                    if (res && res.code === 0) {
                      props.notify("Your DAO avatar is updated", "info");
                      if (props.refresh) await props.refresh();
                    }
                    setImageUrl("");
                    setPreviewAvatarText("Nothing to Preview");
                    setPreviewAvatarUrl(
                      "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=0&caps=1&name=.&background=2d3845"
                    );
                    setLoading(false);
                  }
                }}
                disabled={
                  validateImageUrlError !== null ||
                  previewLoading == true ||
                  imageUrl == ""
                }
              >
                UPDATE
              </label>
            </div>
          </div>
        </div>
        {props.isEditable ? (
          <label htmlFor="avatar-url-modal" className="modal-button">
            <div className="indicator-item indicator-bottom mr-6 mb-6 h-7.5 w-7.5 bg-base-100 rounded-full p-2 border border-grey-300 cursor-pointer hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </label>
        ) : (
          ""
        )}
        <div className="avatar flex-none items-center">
          <div
            className={
              "w-40 h-40 rounded-md border" +
              (props.isEditable ? " border-grey-300" : " border-transparent")
            }
          >
            <img
              src={
                props.org.avatarUrl == ""
                  ? "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                    name.slice(-1)
                  : props.org.avatarUrl
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateDaoAvatar,
  notify,
})(OrgAvatar);
