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
      onEnter: () => { },
      autoFocus: false,
    },
    ref
  ) => {
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
            className={
              "input input-bordered h-24 py-2 focus:outline-none focus:border-type " +
              (props.hint.shown && props.hint.type == "error"
                ? "border-pink text-pink input-" + props.hint.type
                : props.value.length > 0
                ? "border-green"
                : "")
            }
            value={props.value}
            onChange={(e) => {
              props.setValue(e.target.value);
            }}
            data-test={props.name?.replace(' ', '_')}
          />
        ) : (
          <input
            ref={ref}
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            readOnly={props.readOnly}
            className={
              "input input-bordered focus:outline-none focus:border-type " +
              ("input-" + props.size) +
              " " +
              (props.hint.shown && props.hint.type == "error"
                ? "border-pink text-pink input-" + props.hint.type
                : props.value.length > 0
                ? "border-green-900"
                : "")
            }
            value={props.value}
            onKeyUp={(e) => {
              if (e.code === "Enter" || e.code === "NumpadEnter") {
                if (props.onEnter) props.onEnter();
              }
            }}
            onChange={(e) => {
              props.setValue(e.target.value);
            }}
            autoFocus={props.autoFocus}
            data-test={props.name?.replace(' ', '_')}
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
