import { notify } from "reapop";
import { downloadWalletForRemoteHelper } from "../../store/actions/wallet";
import { useDispatch, useSelector, connect } from "react-redux";
import TextInput from "../textInput";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { updateRepositoryDescription } from "../../store/actions/repository";
import { isCurrentUserEligibleToUpdate } from "../../store/actions/repository";
import { useApiClient } from "../../context/ApiClientContext";

function EmptyRepository(props) {
  const { repository } = props;
  const remoteUrl = "gitopia://" + repository.owner.id + "/" + repository.name;
  const dispatch = useDispatch();
  const activeWallet = useSelector((state) => state.wallet.activeWallet);
  let shouldShowDownloadWallet = false;
  const [currentUserEditPermission, setCurrentUserEditPermission] =
    useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newDescriptionHint, setNewDescriptionHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingDescription, setSavingDescription] = useState(false);
  const input = useRef();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  if (activeWallet) {
    if (activeWallet.isKeplr || activeWallet.isLedger) {
    } else {
      shouldShowDownloadWallet = true;
    }
  }
  useEffect(() => {
    async function updatePermissions() {
      setCurrentUserEditPermission(
        await props.isCurrentUserEligibleToUpdate(repository)
      );
    }
    updatePermissions();
  }, [props.user, repository]);

  const validateDescription = (description) => {
    setNewDescriptionHint({
      ...newDescriptionHint,
      shown: false,
    });

    if (description === repository.description) {
      setNewDescriptionHint({
        shown: true,
        type: "error",
        message: "Description is same as earlier",
      });
      return false;
    }
    return true;
  };

  const updateDescription = async () => {
    setSavingDescription(true);
    if (validateDescription(newDescription)) {
      console.log(repository);
      const res = await props.updateRepositoryDescription(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          name: repository.name,
          ownerId: repository.owner.id,
          description: newDescription,
        }
      );

      if (res && res.code === 0) {
        dispatch(notify("Repository description updated", "info"));
        if (props.refreshRepository) await props.refreshRepository();
        setEditDescription(false);
      } else {
      }
    }
    setSavingDescription(false);
  };

  useEffect(() => {
    setNewDescription(repository.description);
    setNewDescriptionHint({ shown: false });
  }, [repository]);

  useEffect(() => {
    if (editDescription && input?.current) {
      input.current.focus();
    }
  }, [editDescription]);

  return (
    <>
      <div className="mt-16">
        <div className="flex">
          <div className="flex-1 text-left text-xl">About</div>
          {!editDescription && currentUserEditPermission ? (
            <div className="flex-none w-44">
              <button
                className="btn btn-outline btn-sm btn-block ml-auto w-54"
                onClick={() => {
                  setEditDescription(true);
                }}
              >
                Edit
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        {editDescription ? (
          <div className="py-1">
            <TextInput
              type="text"
              name="Description"
              placeholder="Description"
              multiline={true}
              value={newDescription}
              setValue={setNewDescription}
              hint={newDescriptionHint}
              size="xs"
              ref={input}
            />
            <div className="flex flex-none w-56 btn-group mt-2">
              <button
                className="flex-1 btn btn-sm text-xs "
                onClick={() => {
                  setEditDescription(false);
                  setNewDescription(repository.description);
                  setNewDescriptionHint({ shown: false });
                }}
              >
                Cancel
              </button>
              <button
                className={
                  "flex-1 btn btn-sm btn-primary text-xs " +
                  (savingDescription ? "loading" : "")
                }
                onClick={updateDescription}
                disabled={savingDescription}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3">{repository.description}</div>
        )}
      </div>
      <div className="sm:flex rounded-md py-2 mt-16 items-center">
        <div className="flex-none w-72 text-xl">Quick Setup</div>
        <div className="mt-8 sm:mt-0 flex-1 flex items-center">
          <div className="flex-none text-xs uppercase text-type-secondary mr-4 font-bold">
            Remote
          </div>
          <div className="form-control flex-1">
            <div className="relative">
              <input
                name="repository-url"
                type="text"
                value={remoteUrl}
                readOnly={true}
                className="w-full pr-16 input input-ghost input-bordered"
              />
              <button
                className="absolute right-0 top-0 rounded btn btn-ghost"
                onClick={(e) => {
                  navigator.clipboard.writeText(remoteUrl);
                  dispatch(notify("Copied to clipboard", "info"));
                }}
              >
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="sm:py-8">
          <div className="alert alert-warning justify-center">
            <div className="flex flex-col sm:flex-row">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-4 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="mr-2 mt-0.5">
                  Install gitopia remote helper first
                </span>
              </div>
              <div>
                <a
                  href="https://docs.gitopia.com/git-remote-gitopia"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-outline btn-sm"
                >
                  Learn more
                </a>
                {shouldShowDownloadWallet ? (
                  <button
                    onClick={() => {
                      dispatch(downloadWalletForRemoteHelper());
                    }}
                    className="ml-4 btn btn-secondary btn-outline btn-sm"
                  >
                    Download wallet
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md py-6 sm:py-8">
          <div className="py-4">
            <div className="flex mb-4">
              <div className="flex-1 text-xl">
                Push existing repository from command line
              </div>
              <div className="flex-none w-44">
                <button
                  className="btn btn-outline btn-sm btn-block"
                  onClick={(e) => {
                    navigator.clipboard.writeText(
                      "git remote add origin " +
                        remoteUrl +
                        "\ngit push -u origin master"
                    );
                    dispatch(notify("Copied to clipboard", "info"));
                  }}
                >
                  Copy commands
                </button>
              </div>
            </div>
            <div className="mockup-code mb-4">
              <pre data-prefix="$">
                <code>git remote add origin {remoteUrl}</code>
              </pre>
              <pre data-prefix="$">
                <code>git push -u origin master</code>
              </pre>
            </div>
          </div>
        </div>
        {/* <div className="rounded-md py-8 flex flex-col">
          <div className="flex-1 mb-8 text-type-tertiary">
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <div className="flex-none py-4">
            <div className="flex mb-4">
              <div className="flex-1 text-xl">
                Import code from another repository
              </div>
              <div className="flex-none w-44">
                <button className="btn btn-primary btn-outline btn-sm btn-block">
                  Copy commands
                </button>
              </div>
            </div>
          </div>
        </div> */}
        <div className="rounded-md sm:py-8">
          <div className="flex-none py-4">
            <div className="flex mb-4">
              <div className="flex-1 text-xl">
                Create a new repository from command line
              </div>
              <div className="flex-none w-44">
                <button
                  className="btn btn-outline btn-sm btn-block"
                  onClick={(e) => {
                    navigator.clipboard.writeText(
                      'echo "# hello world" >> README.md\ngit init\ngit add README.md\ngit commit -m "initial commit"\ngit remote add origin ' +
                        remoteUrl +
                        "\ngit push -u origin master"
                    );
                    dispatch(notify("Copied to clipboard", "info"));
                  }}
                >
                  Copy commands
                </button>
              </div>
            </div>
            <div className="mockup-code mb-4">
              <pre data-prefix="$">
                <code>{'echo "# hello world" >> README.md'}</code>
              </pre>
              <pre data-prefix="$">
                <code>git init</code>
              </pre>
              <pre data-prefix="$">
                <code>git add README.md</code>
              </pre>
              <pre data-prefix="$">
                <code>{'git commit -m "initial commit"'}</code>
              </pre>
              <pre data-prefix="$">
                <code>git remote add origin {remoteUrl}</code>
              </pre>
              <pre data-prefix="$">
                <code>git push -u origin master</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  isCurrentUserEligibleToUpdate,
  updateRepositoryDescription,
})(EmptyRepository);
