import React from "react";

const TextInput = React.forwardRef(
  (
    props = {
      label: "",
      type: "text",
      name: "",
      placeholder: "",
      value: "",
      setValue: () => {},
      hint: { shown: false, type: "", message: "" },
      setHint: () => {},
      multiline: false,
      readOnly: false,
      required: false,
      className: "",
      size: "md",
      onEnter: () => {},
      autoFocus: false,
    },
    ref
  ) => {
    const value = props.value ?? "";

    const getInputClassName = () => {
      let className =
        "input input-bordered focus:outline-none focus:border-type ";
      className += `input-${props.size} `;

      if (props.hint.shown && props.hint.type === "error") {
        className += "border-pink text-pink input-error ";
      } else if (value.length > 0) {
        className += "border-green-900 ";
      }

      return className.trim();
    };

    return (
      <div className={"form-control " + props.className}>
        {props.label ? (
          <label className="label">
            <span className="label-text">{props.label}</span>
          </label>
        ) : (
          ""
        )}
        {props.multiline ? (
          <textarea
            ref={ref}
            rows={5}
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            required={props.required}
            className={getInputClassName() + " h-24 py-2"}
            value={value}
            onChange={(e) => {
              props.setValue(e.target.value);
            }}
            data-test={props.name?.replace(" ", "_")}
          />
        ) : (
          <input
            ref={ref}
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            className={getInputClassName()}
            value={value}
            onKeyUp={(e) => {
              if (e.code === "Enter" || e.code === "NumpadEnter") {
                if (props.onEnter) props.onEnter();
              }
            }}
            onChange={(e) => {
              props.setValue(e.target.value);
            }}
            autoFocus={props.autoFocus}
            data-test={props.name?.replace(" ", "_")}
          />
        )}

        {props.hint.shown && (
          <label className="label">
            <span className={"label-text-alt text-" + props.hint.type}>
              {props.hint.message}
            </span>
          </label>
        )}
      </div>
    );
  }
);

export default TextInput;
