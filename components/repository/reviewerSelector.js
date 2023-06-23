import { useEffect, useState, useRef } from "react";
import shrinkAddress from "../../helpers/shrinkAddress";
import getUser from "../../helpers/getUser";
import validAddress from "../../helpers/validAddress";
import AccountCard from "../../components/account/card";

function ReviewerSelector({ collaborators = [], reviewers = [], onChange }) {
  const [newReviewers, setNewReviewers] = useState([]);
  const [validateAddressError, setValidateAddressError] = useState(null);
  const [checkMap, setCheckMap] = useState({});
  const menuDiv = useRef(null);
  const inputEl = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const reviewersModal = useRef();

  const collabAddresses = collaborators
    .filter((x) => x.permission !== "READ")
    .map((x) => x.id);

  const validateUserAddress = async (address) => {
    if (collabAddresses.includes(address) || newReviewers.includes(address)) {
      setCheckMap({ ...checkMap, [address]: true });
      setValidateAddressError("Address already present");
      return false;
    }
    if (address.trim() !== "" && validAddress.test(address)) {
      const res = await getUser(address);
      if (res) {
        setValidateAddressError(null);
        return true;
      } else {
        setValidateAddressError("User not found");
        return false;
      }
    }
    setValidateAddressError("Enter a valid address");
    return false;
  };

  const updateReviewers = async () => {
    const list = [];
    setIsSaving(true);
    for (let address in checkMap) {
      if (checkMap[address] && !list.includes(address)) list.push(address);
    }
    if (onChange) await onChange(list);
    setNewReviewers([]);
    setIsSaving(false);
  };

  const resetReviewers = () => {
    const newCheckMap = {};
    const otherAddresses = [];
    reviewers.map((a) => {
      newCheckMap[a] = true;
      if (!collabAddresses.includes(a)) {
        otherAddresses.push(a);
      }
    });
    setNewReviewers(otherAddresses);
    setCheckMap(newCheckMap);
  };

  useEffect(resetReviewers, [reviewers]);

  return (
    <div className={"w-full"} tabIndex="0">
      <label
        className={
          "btn btn-sm btn-block btn-ghost modal-button " +
          (isSaving ? "loading" : "")
        }
        htmlFor="reviewer-modal"
      >
        <div className="flex-1 text-left">Reviewers</div>
        <svg
          viewBox="0 0 32 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
        >
          <path
            d="M13.3645 13.8645V13.8645C13.3645 12.8348 14.1993 12 15.2291 12H15.3645C16.4691 12 17.3645 12.8954 17.3645 14V14C17.3645 15.1046 16.4691 16 15.3645 16H13.3645"
            stroke="#ADBECB"
            strokeWidth="1.5"
          />
          <path
            d="M14 18L14 20"
            stroke="#ADBECB"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle
            cx="15.0979"
            cy="15.5867"
            r="7.64496"
            transform="rotate(-30 15.0979 15.5867)"
            stroke="#ADBECB"
            strokeWidth="2"
          />
          <path
            d="M21.7 26.6C22.0314 27.0418 22.6582 27.1314 23.1 26.8C23.5418 26.4686 23.6314 25.8418 23.3 25.4L21.7 26.6ZM18.7 22.6L21.7 26.6L23.3 25.4L20.3 21.4L18.7 22.6Z"
            fill="#ADBECB"
          />
        </svg>
      </label>

      <input
        type="checkbox"
        id="reviewer-modal"
        className="modal-toggle"
        ref={reviewersModal}
      />
      <div className="modal">
        <div className="modal-box shadow-lg shadow-lg bg-[#28313B] rounded p-4 mt-1 h-fit">
          <div className="flex">
            <div className="text-type-primary text-lg font-bold">Reviewers</div>
            <label
              className="btn btn-circle btn-sm btn-ghost ml-auto"
              htmlFor="reviewer-modal"
              onClick={() => {
                setSearchAddress("");
                setValidateAddressError(null);
              }}
            >
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5303 2.0304C13.8231 1.73751 13.8231 1.26264 13.5303 0.969744C13.2374 0.676851 12.7625 0.676851 12.4696 0.969744L13.5303 2.0304ZM0.46967 12.9697C0.176777 13.2626 0.176777 13.7374 0.46967 14.0303C0.762563 14.3232 1.23744 14.3232 1.53033 14.0303L0.46967 12.9697ZM12.4696 14.0303C12.7625 14.3231 13.2374 14.3231 13.5303 14.0303C13.8231 13.7374 13.8231 13.2625 13.5303 12.9696L12.4696 14.0303ZM1.53033 0.96967C1.23744 0.676777 0.762563 0.676777 0.46967 0.96967C0.176777 1.26256 0.176777 1.73744 0.46967 2.03033L1.53033 0.96967ZM12.4696 0.969744L0.46967 12.9697L1.53033 14.0303L13.5303 2.0304L12.4696 0.969744ZM13.5303 12.9696L1.53033 0.96967L0.46967 2.03033L12.4696 14.0303L13.5303 12.9696Z"
                  fill="#E5EDF5"
                />
              </svg>
            </label>
          </div>
          <div className="form-control mb-2 mt-4">
            <input
              name="search"
              type="text"
              placeholder="Search By Address"
              autoComplete="off"
              ref={inputEl}
              value={searchAddress}
              onKeyUp={async (e) => {
                const val = e.target.value;
                if (await validateUserAddress(val)) {
                  setNewReviewers([...newReviewers, val]);
                  setCheckMap({ ...checkMap, [val]: true });
                  setSearchAddress("");
                }
              }}
              onChange={(e) => {
                setSearchAddress(e.target.value);
              }}
              className="w-full input input-sm input-ghost input-bordered"
            />
            {validateAddressError ? (
              <label className="label">
                <span className="label-text-alt text-error">
                  {validateAddressError}
                </span>
              </label>
            ) : (
              ""
            )}
          </div>
          <div className="">
            {collabAddresses.length ? (
              <div className="py-2 text-type-secondary font-bold text-xs uppercase">
                Collaborators
              </div>
            ) : (
              ""
            )}
            {collabAddresses.map((c, i) => {
              return (
                <div className="form-control" key={"collaborator" + i}>
                  <label className="cursor-pointer label justify-start">
                    <input
                      type="checkbox"
                      checked={checkMap[c]}
                      onChange={() => {
                        setCheckMap({ ...checkMap, [c]: !checkMap[c] });
                      }}
                      className="checkbox checkbox-sm mr-2"
                    />
                    <AccountCard id={c} showAvatar={true} avatarSize="xs" />
                  </label>
                </div>
              );
            })}
            {newReviewers.length ? (
              <div className="py-2 text-type-secondary font-bold text-xs uppercase">
                Others
              </div>
            ) : (
              ""
            )}
            {newReviewers.map((a, i) => {
              return (
                <div className="form-control" key={"newreviewers" + i}>
                  <label className="cursor-pointer label justify-start">
                    <input
                      type="checkbox"
                      checked={checkMap[a]}
                      onChange={() => {
                        setCheckMap({ ...checkMap, [a]: !checkMap[a] });
                      }}
                      className="checkbox checkbox-sm mr-2"
                    />
                    <AccountCard id={a} showAvatar={true} avatarSize="xs" />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-2 mb-4 mt-4 modal-action">
            <button
              className={
                "btn btn-primary btn-block flex-1 " +
                (isSaving ? "loading" : "")
              }
              onClick={(e) => {
                updateReviewers();
                setSearchAddress("");
                setValidateAddressError(null);
                if (menuDiv.current) {
                  menuDiv.current.blur();
                }
                if (reviewersModal?.current) {
                  reviewersModal.current.checked = false;
                }
                e.stopPropagation();
              }}
              disabled={isSaving}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewerSelector;
