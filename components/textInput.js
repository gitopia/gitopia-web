import React, { useEffect, useRef } from "react";

const TextInput = React.forwardRef(
  (
    {
      label = "",
      type = "text",
      name = "",
      placeholder = "",
      value = "",
      setValue = () => {},
      hint = { shown: false, type: "", message: "" },
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
    const textareaRef = useRef(null);

    useEffect(() => {
      if (multiline && textareaRef.current) {
        // Reset height to auto to correctly calculate new height
        textareaRef.current.style.height = "auto";
        // Set new height based on scrollHeight with a small buffer for smooth typing
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight + 2, 400) + "px";
      }
    }, [value, multiline]);

    const getInputClassName = () => {
      let className =
        "input input-bordered focus:outline-none focus:border-type ";
      className += `input-${size} `;

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
            ref={(el) => {
              textareaRef.current = el;
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            rows={1}
            type={type}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            disabled={disabled}
            className={`${getInputClassName()} min-h-[80px] max-h-[400px] py-2 resize-none overflow-y-auto transition-height duration-100`}
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
