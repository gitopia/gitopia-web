import React from "react";

const TextInput = React.forwardRef(
  (
    {
      label = "",
      type = "text",
      name = "",
      placeholder = "",
      value = "",
      setValue = () => {},
      hint = { shown: false, type: "", message: "" }, // Provide default value
      setHint = () => {},
      multiline = false,
      readOnly = false,
      required = false,
      className = "",
      size = "md",
      onEnter = () => {},
      autoFocus = false,
      disabled = false,
    },
    ref
  ) => {
    const getInputClassName = () => {
      let className =
        "input input-bordered focus:outline-none focus:border-type ";
      className += `input-${size} `;

      // Safe access of hint properties
      if (hint?.shown && hint?.type === "error") {
        className += "border-pink text-pink input-error ";
      } else if (value?.length > 0) {
        className += "border-green-900 ";
      }

      return className.trim();
    };

    return (
      <div className={"form-control " + className}>
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}

        {multiline ? (
          <textarea
            ref={ref}
            rows={5}
            type={type}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            disabled={disabled}
            className={getInputClassName() + " h-24 py-2"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            data-test={name?.replace(" ", "_")}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            className={getInputClassName()}
            value={value}
            onKeyUp={(e) => {
              if (e.code === "Enter" || e.code === "NumpadEnter") {
                onEnter();
              }
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            autoFocus={autoFocus}
            data-test={name?.replace(" ", "_")}
          />
        )}

        {hint?.shown && (
          <label className="label">
            <span className={`label-text-alt text-${hint.type}`}>
              {hint.message}
            </span>
          </label>
        )}
      </div>
    );
  }
);

// Add display name for React DevTools
TextInput.displayName = "TextInput";

export default TextInput;
