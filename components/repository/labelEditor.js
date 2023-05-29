import { useState, useEffect } from "react";

import { connect } from "react-redux";
import Label from "./label";
import {
  createRepositoryLabel,
  updateRepositoryLabel,
} from "../../store/actions/repository";
import useWindowSize from "../../hooks/useWindowSize";

const defaultLabels = [
  {
    name: "bug",
    description: "Something isn't working",
    color: "#c10d10",
  },
  {
    name: "documentation",
    description: "Improvements or additions to documentation",
    color: "#2469ce",
  },
  {
    name: "help wanted",
    description: "Extra attention is needed",
    color: "#22b998",
  },
  {
    name: "enhancement",
    description: "New feature or request",
    color: "#119292",
  },
  {
    name: "invalid",
    description: "This dosen't seem right",
    color: "#949419",
  },
  {
    name: "wontfix",
    description: "This will not be worked on",
    color: "#504486",
  },
];

function LabelEditor({
  repoOwner,
  repoName,
  labelId,
  onSuccess,
  onError,
  onCancel,
  isEdit = false,
  initialLabel = { name: "", description: "", color: "#FFFFFF" },
  ...props
}) {
  const [name, setName] = useState(initialLabel.name);
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [description, setDescription] = useState(initialLabel.description);
  const [descriptionHint, setDescriptionHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [color, setColor] = useState(initialLabel.color);
  const [colorHint, setColorHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { isMobile } = useWindowSize();
  const shouldShowSuggestions = !isEdit;

  const validateLabel = () => {
    resetHints();
    if (name.trim() === "") {
      setNameHint({
        shown: true,
        type: "error",
        message: "Please enter a name",
      });
      return false;
    }
    if (description.trim() === "") {
      setDescriptionHint({
        shown: true,
        type: "error",
        message: "Please enter a description",
      });
      return false;
    }
    return true;
  };

  const resetHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
    setColorHint({ ...colorHint, shown: false });
  };

  const onCreateLabel = async () => {
    setIsSaving(true);
    if (validateLabel()) {
      const res = await props.createRepositoryLabel({
        repoOwner,
        repoName,
        name,
        color,
        description,
      });
      if (res && res.code === 0) {
        if (onSuccess) await onSuccess({ name, description, color });
        setName(initialLabel.name);
        setDescription(initialLabel.description);
        setColor(initialLabel.color);
        resetHints();
      } else {
        if (onError) await onError(res);
      }
    } else {
      if (onError) onError({ code: 1, message: "Validation error" });
    }
    setIsSaving(false);
  };

  const onUpdateLabel = async () => {
    setIsSaving(true);
    if (validateLabel()) {
      const res = await props.updateRepositoryLabel({
        repoOwner,
        repoName,
        labelId,
        name,
        color,
        description,
      });
      if (res && res.code === 0) {
        if (onSuccess) await onSuccess({ name, description, color });
      } else {
        if (onError) await onError(res);
      }
    }
    setIsSaving(false);
  };

  return (
    <div className="w-full">
      <div>
        <div className="ml-1">
          <span className="text-xs uppercase text-type-secondary mr-4 font-bold">
            Preview
          </span>
          <Label name={name} color={color} />
        </div>
        <div className="sm:flex mt-5 border border-[#747D96] rounded-lg">
          <div className="ml-2 w-full">
            <input
              className="appearance-none bg-transparent border-none text-gray-200 mr-3 py-2 leading-tight focus:outline-none sm:text-sm w-20"
              type="text"
              name="label_name"
              placeholder="Name"
              aria-label="Name"
              value={name}
              onKeyUp={async (e) => {
                await validateLabel(e.target.value);
              }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>
          <div className={"flex " + (isMobile ? "mt-3 mb-3" : "")}>
            <div className="flex-1 mr-4">
              <input
                className="appearance-none bg-transparent border-none text-gray-200 mr-3 py-2 leading-tight focus:outline-none sm:text-sm w-44"
                type="text"
                name="label_description"
                placeholder="Description"
                aria-label="Description"
                value={description}
                onKeyUp={async (e) => {
                  await validateLabel(e.target.value);
                }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex-none mr-4 mt-1">
              <input
                className="appearance-none bg-transparent border-none focus:outline-none h-7 w-6"
                type="color"
                name="label_color"
                placeholder="Color"
                aria-label="Color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="flex flex-none w-60 btn-group mb-2">
            <button
              className={
                "link text-xs uppercase no-underline font-bold text-primary mt-2 " +
                (isSaving ? "loading" : "")
              }
              onClick={isEdit ? onUpdateLabel : onCreateLabel}
              disabled={isSaving}
              data-test="save_label"
            >
              {isEdit ? "Update Label" : "Create Label"}
            </button>
          </div>
        </div>
        {nameHint.shown && (
          <label className="label">
            <span className={"label-text-alt text-" + nameHint.type}>
              {nameHint.message}
            </span>
          </label>
        )}
        {descriptionHint.shown && (
          <label className="label">
            <span className={"label-text-alt text-" + descriptionHint.type}>
              {descriptionHint.message}
            </span>
          </label>
        )}
        {colorHint.shown && (
          <label className="label">
            <span className={"label-text-alt text-" + colorHint.type}>
              {colorHint.message}
            </span>
          </label>
        )}
      </div>
      {shouldShowSuggestions ? (
        <div className="mt-6 ml-1 mb-10">
          <div className="mb-2">
            <div className="text-type-primary uppercase text-xs font-bold">
              Common Labels
            </div>
          </div>
          {defaultLabels.map((dl, i) => (
            <span
              className="mr-2"
              key={"suggestedLabel" + i}
              data-test="common_labels"
            >
              <Label
                color={dl.color}
                name={dl.name}
                onClick={() => {
                  setName(dl.name);
                  setDescription(dl.description);
                  setColor(dl.color);
                }}
              />
            </span>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default connect(null, { createRepositoryLabel, updateRepositoryLabel })(
  LabelEditor
);
