import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { updateDaoWebsite } from "../../store/actions/dao";
import { notify } from "reapop";
import TextInput from "../textInput";
import { useApiClient } from "../../context/ApiClientContext";

function DaoWebsite(props = { isEditable: false }) {
  const [newWebsite, setNewWebsite] = useState(props.dao?.website || "");
  const [newWebsiteHint, setNewWebsiteHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingWebsite, setSavingWebsite] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const input = useRef();
  const { apiClient } = useApiClient();

  useEffect(() => {
    setNewWebsite(props.dao?.website || "");
  }, [props.dao?.website]);

  useEffect(() => {
    if (modalOpen && input?.current) {
      input.current.focus();
    }
  }, [modalOpen]);

  const reset = () => {
    setNewWebsite(props.dao.website);
    setNewWebsiteHint({ shown: false });
    setModalOpen(false);
  };

  const updateWebsite = async () => {
    setSavingWebsite(true);
    const res = await props.updateDaoWebsite(apiClient, {
      id: props.dao.address,
      website: newWebsite,
    });
    if (res && res.code === 0) {
      props.notify(props.dao.name + " website is updated", "info");
      if (props.refresh) await props.refresh();
      setModalOpen(false);
    }
    setNewWebsiteHint({ shown: false });
    setSavingWebsite(false);
  };

  return (
    <div className="inline-block">
      <input
        type="checkbox"
        id="website-edit-modal"
        className="modal-toggle"
        checked={modalOpen}
        disabled={!props.isEditable}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="website-edit-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={reset}
          >
            ✕
          </label>
          <label className="label">
            <span className="label-text text-xs font-bold text-gray-400">
              WEBSITE
            </span>
          </label>
          <TextInput
            type="text"
            name="website"
            placeholder="Enter Website"
            value={newWebsite}
            setValue={setNewWebsite}
            hint={newWebsiteHint}
            size="lg"
            ref={input}
          />
          <div className="modal-action">
            <button
              className={
                "w-36 btn btn-sm btn-primary" +
                (savingWebsite ? " loading" : "")
              }
              disabled={savingWebsite}
              onClick={updateWebsite}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <label
        htmlFor="website-edit-modal"
        onClick={() => {
          if (props.isEditable) setModalOpen(true);
        }}
        className={
          "py-1 border-b mr-2 flex items-center" +
          (props.isEditable
            ? " border-grey-300 hover:text-primary cursor-pointer"
            : " border-transparent") +
          (props.dao.website == "" ? " text-grey italic" : "")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>

        {props.isEditable ? (
          props.dao.website ? (
            props.dao.website
          ) : (
            "No Website"
          )
        ) : (
          <a
            className="link no-underline hover:underline"
            href={props.dao.website}
            target="_blank"
            rel="noreferrer"
          >
            {props.dao.website}
          </a>
        )}
      </label>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateDaoWebsite,
  notify,
})(DaoWebsite);
