import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  updateUserAvatar,
  signUploadFileMessage,
} from "../../store/actions/user";
import { updateDaoAvatar } from "../../store/actions/dao";
import { notify } from "reapop";
import formatBytes from "../../helpers/formatBytes";

function AccountAvatar({ isEditable = false, isDao = false, ...props }) {
  const name = isDao
    ? props.dao.name
      ? props.dao.name
      : "."
    : props.user.creator
    ? props.user.creator
    : ".";
  const [validateImageUrlError, setValidateImageUrlError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);
  const [previewAvatarText, setPreviewAvatarText] = useState(
    "Nothing to preview"
  );
  const [currentTab, setCurrentTab] = useState("upload");
  const [imageFile, setImageFile] = useState(null);
  const imageFileInput = useRef();
  const [imageFileHash, setImageFileHash] = useState(null);
  const [imageUploading, setImageUploading] = useState(0);

  useEffect(() => {
    setValidateImageUrlError("");
    let url = isDao ? props.dao?.avatarUrl : props.user?.avatarUrl;
    setImageUrl(url);
    setPreviewAvatarUrl(url);
    !url || url === ""
      ? setPreviewAvatarText("Nothing to preview")
      : setPreviewAvatarText("");
    setImageFile(null);
    if (imageFileInput.current) {
      imageFileInput.current.value = null;
    }
    setImageFileHash(null);
  }, [isDao ? props.dao?.id : props.user?.id]);

  const validateImageUrl = (url, setImageUrlAfterSuccess) => {
    if (url == "") {
      setValidateImageUrlError(null);
      setPreviewAvatarText("Nothing to preview");
      setPreviewAvatarUrl(null);
      return;
    }
    setValidateImageUrlError(null);
    setPreviewLoading(true);
    setPreviewAvatarText("Loading...");
    setPreviewAvatarUrl(null);
    var image = new Image();
    image.onload = function () {
      if (this.width > 0) {
        setPreviewLoading(false);
        setValidateImageUrlError(null);
        setPreviewAvatarText("");
        setPreviewAvatarUrl(url);
        if (setImageUrlAfterSuccess) {
          setImageUrl(url);
        }
      }
    };
    image.onerror = function () {
      setPreviewLoading(false);
      setValidateImageUrlError("Unable to preview");
      setPreviewAvatarText("");
      if (setImageUrlAfterSuccess) {
        setImageUrl("");
      }
      setPreviewAvatarUrl("");
    };
    image.src = url;
  };

  const uploadImage = async () => {
    if (imageFile) {
      setImageUploading(1);

      const tx = await props.signUploadFileMessage(
        imageFile.name,
        imageFile.size,
        imageFileHash
      );

      if (!tx) {
        setImageUploading(0);
        return;
      }

      let formData = new FormData();
      formData.append("tx", tx);
      formData.append("image", imageFile);

      let res = await fetch("/api/upload-profile-image", {
        method: "post",
        credentials: "same-origin",
        body: formData,
      }).then((response) => {
        if (response.status === 200) return response.json();
        else return response.text();
      });
      if (res && res.url) {
        validateImageUrl(res.url, true);
        setImageUploading(2);
      } else if (res) {
        setValidateImageUrlError(res);
        setImageUploading(0);
      }
    }
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
              <div
                className={
                  "relative w-40 h-40 border border-grey" +
                  (isDao ? " rounded-md" : " rounded-full")
                }
              >
                {previewAvatarUrl ? <img src={previewAvatarUrl} /> : ""}
                <div className="absolute w-full bottom-16 text-center italic text-grey-300 text-sm">
                  {previewAvatarText}
                </div>
              </div>
            </div>
            <div className="tabs mb-4 mt-4">
              <div
                className={
                  "tab tab-sm tab-bordered" +
                  (currentTab === "upload" ? " tab-active" : "")
                }
                onClick={() => {
                  setCurrentTab("upload");
                }}
              >
                Upload File
              </div>
              <div
                className={
                  "tab tab-sm tab-bordered" +
                  (currentTab === "url" ? " tab-active" : "")
                }
                onClick={() => {
                  setCurrentTab("url");
                }}
              >
                Image Url
              </div>
            </div>
            {currentTab === "upload" ? (
              <div>
                <input
                  name="profile_picture"
                  placeholder="Upload"
                  type="file"
                  className="w-full h-11 pt-2 input input-xs input-ghost input-bordered "
                  accept="image/jpg, image/jpeg, image/png, image/gif"
                  onChange={async (e) => {
                    if (e.target.files.length) {
                      let file = e.target.files[0];
                      if (
                        file.size >
                        process.env.NEXT_PUBLIC_MAX_AVATAR_IMAGE_SIZE_BYTES
                      ) {
                        setValidateImageUrlError(
                          "File too big (>" +
                            formatBytes(
                              process.env
                                .NEXT_PUBLIC_MAX_AVATAR_IMAGE_SIZE_BYTES
                            ) +
                            ")"
                        );
                        return;
                      }
                      let reader = new FileReader();
                      const CryptoJS = (await import("crypto-js")).default;

                      reader.onload = function (event) {
                        let binary = event.target.result;
                        let md5 = CryptoJS.MD5(
                          CryptoJS.enc.Latin1.parse(binary)
                        ).toString();

                        setImageFile(file);
                        setImageFileHash(md5);
                        setImageUploading(0);
                      };

                      reader.readAsBinaryString(file);
                    } else {
                      setImageFile(null);
                      if (imageFileInput.current) {
                        imageFileInput.current.value = null;
                      }
                      setImageFileHash(null);
                    }
                  }}
                />
              </div>
            ) : (
              ""
            )}
            {currentTab === "url" ? (
              <div>
                <input
                  name="Image Url"
                  placeholder="Enter Url"
                  autoComplete="off"
                  value={imageUrl}
                  onKeyUp={async (e) => {
                    validateImageUrl(e.target.value);
                  }}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                  }}
                  className="w-full h-11 input input-xs input-ghost input-bordered "
                />
              </div>
            ) : (
              ""
            )}
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
                  Checking avatar url...
                </span>
              </label>
            ) : (
              ""
            )}
            <div className="modal-action ml-auto w-28">
              {currentTab === "upload" ? (
                <button
                  className={
                    "btn btn-sm btn-block" +
                    (imageUploading === 1 ? " loading" : "")
                  }
                  disabled={imageUploading}
                  onClick={uploadImage}
                >
                  UPLOAD
                </button>
              ) : (
                ""
              )}
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
                    const res = isDao
                      ? await props.updateDaoAvatar({
                          id: props.dao.address,
                          url: imageUrl,
                        })
                      : await props.updateUserAvatar(imageUrl);
                    if (res && res.code === 0) {
                      props.notify(
                        "Your " +
                          (isDao ? "DAO" : "user") +
                          " avatar is updated",
                        "info"
                      );
                      if (props.refresh) await props.refresh();
                    }
                    setImageUrl("");
                    setPreviewAvatarText("Nothing to preview");
                    setPreviewAvatarUrl("");
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
        {isEditable ? (
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
              "w-40 h-40 border" +
              (isDao ? " rounded-md" : " rounded-full") +
              (isEditable ? " border-grey-300" : " border-transparent")
            }
          >
            <img
              src={
                isDao
                  ? props.dao.avatarUrl == ""
                    ? "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                      name.slice(-1)
                    : props.dao.avatarUrl
                  : props.user.avatarUrl == ""
                  ? "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                    name.slice(-1)
                  : props.user.avatarUrl
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
  updateUserAvatar,
  updateDaoAvatar,
  signUploadFileMessage,
  notify,
})(AccountAvatar);