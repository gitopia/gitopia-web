import { notify } from "reapop";
import { downloadWalletForRemoteHelper } from "../../store/actions/wallet";
import { useDispatch } from "react-redux";

export default function EmptyRepository(props) {
  const { repository } = props;
  const remoteUrl = "gitopia://" + repository.owner.id + "/" + repository.name;
  const dispatch = useDispatch();
  return (
    <>
      <div className="flex rounded-md py-2 mt-16 items-center">
        <div className="flex-none w-72 text-xl">Quick Setup</div>
        <div className="flex-1 flex items-center">
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
        <div className="py-8">
          <div className="flex items-center justify-center p-2 rounded text-sm alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mr-2">Install gitopia remote helper first.</span>
            <a
              href="https://docs.gitopia.com/git-remote-gitopia"
              target="_blank"
              className="link link-primary no-underline hover:underline"
            >
              Learn more
            </a>
          </div>
        </div>
        <div className="rounded-md py-8">
          <div className="mb-8 text-type-tertiary">
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
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
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
        <div className="rounded-md py-8">
          <div className="mb-8 text-type-tertiary">
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
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
                <code>echo "# hello world" >> README.md</code>
              </pre>
              <pre data-prefix="$">
                <code>git init</code>
              </pre>
              <pre data-prefix="$">
                <code>git add README.md</code>
              </pre>
              <pre data-prefix="$">
                <code>git commit -m "initial commit"</code>
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
