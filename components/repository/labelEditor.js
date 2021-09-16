import { useState } from "react";
import TextInput from "../textInput";
import { connect } from "react-redux";
import Label from "./label";
import {
  createRepositoryLabel,
  updateRepositoryLabel,
} from "../../store/actions/repository";

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
  repoId,
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
        repoId,
        name,
        color,
        description,
      });
      if (res && res.code === 0) {
        if (onSuccess) await onSuccess({ name, description, color });
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
        repoId,
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
    <div>
      <div className="ml-1">
        <span className="text-xs uppercase text-type-secondary mr-4 font-bold">
          Preview
        </span>
        <Label name={name} color={color} />
      </div>
      <div className="flex mt-4">
        <div className="flex-none w-60 mr-4">
          <TextInput
            type="text"
            name="label_name"
            placeholder="Name"
            value={name}
            setValue={setName}
            hint={nameHint}
            size="sm"
          />
        </div>
        <div className="flex-1 mr-4">
          <TextInput
            type="text"
            name="label_description"
            placeholder="Description"
            value={description}
            setValue={setDescription}
            hint={descriptionHint}
            size="sm"
          />
        </div>
        <div className="flex-none mr-4">
          <TextInput
            type="color"
            name="label_color"
            placeholder="Color"
            value={color}
            setValue={setColor}
            hint={colorHint}
            size="sm"
          />
        </div>
        <div className="flex flex-none w-60 btn-group">
          <button className={"flex-1 btn btn-sm btn-block "} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={
              "flex-1 btn btn-sm btn-primary btn-block " +
              (isSaving ? "loading" : "")
            }
            onClick={isEdit ? onUpdateLabel : onCreateLabel}
            disabled={isSaving}
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
      {shouldShowSuggestions ? (
        <div className="mt-6 ml-1">
          <span className="text-xs uppercase text-type-secondary mr-4 font-bold">
            Common labels
          </span>
          {defaultLabels.map((dl, i) => (
            <span className="mr-2" key={"suggestedLabel" + i}>
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
