import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { updateDaoLocation } from "../../store/actions/dao";
import { notify } from "reapop";
import TextInput from "../textInput";
import { useApiClient } from "../../context/ApiClientContext";

function DaoLocation(props = { isEditable: false }) {
  const [newLocation, setNewLocation] = useState(props.dao?.location || "");
  const [newLocationHint, setNewLocationHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingLocation, setSavingLocation] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const input = useRef();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  useEffect(() => {
    setNewLocation(props.dao?.location || "");
  }, [props.dao?.location]);

  useEffect(() => {
    if (modalOpen && input?.current) {
      input.current.focus();
    }
  }, [modalOpen]);

  const reset = () => {
    setNewLocation(props.dao.location);
    setNewLocationHint({ shown: false });
    setModalOpen(false);
  };

  const updateLocation = async () => {
    setSavingLocation(true);
    const res = await props.updateDaoLocation(
      apiClient,
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      {
        id: props.dao.address,
        location: newLocation,
      }
    );
    if (res && res.code === 0) {
      props.notify(props.dao.name + " location is updated", "info");
      if (props.refresh) await props.refresh();
      setModalOpen(false);
    }
    setNewLocationHint({ shown: false });
    setSavingLocation(false);
  };

  return (
    <div className="inline-block">
      <input
        type="checkbox"
        id="location-edit-modal"
        className="modal-toggle"
        checked={modalOpen}
        disabled={!props.isEditable}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="location-edit-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={reset}
          >
            ✕
          </label>
          <label className="label">
            <span className="label-text text-xs font-bold text-gray-400">
              LOCATION
            </span>
          </label>
          <TextInput
            type="text"
            name="location"
            placeholder="Enter Location"
            value={newLocation}
            setValue={setNewLocation}
            hint={newLocationHint}
            size="lg"
            ref={input}
          />
          <div className="modal-action">
            <button
              className={
                "w-36 btn btn-sm btn-primary" +
                (savingLocation ? " loading" : "")
              }
              disabled={savingLocation}
              onClick={updateLocation}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <label
        htmlFor="location-edit-modal"
        onClick={() => {
          if (props.isEditable) setModalOpen(true);
        }}
        className={
          "py-1 border-b mr-2 flex items-center" +
          (props.isEditable
            ? " border-grey-300 hover:text-primary cursor-pointer"
            : " border-transparent") +
          (props.dao.location == "" ? " text-grey italic" : "")
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>
          {props.isEditable
            ? props.dao.location
              ? props.dao.location
              : "No Location"
            : props.dao.location}
        </span>
      </label>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateDaoLocation,
  notify,
})(DaoLocation);
