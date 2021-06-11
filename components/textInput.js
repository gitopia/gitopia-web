export default function TextInput(
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
  }
) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{props.label}</span>
      </label>
      {props.multiline ? (
        <textarea
          rows={5}
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          className={
            "input input-bordered h-24 " +
            (props.hint.shown ? "input-" + props.hint.type : "")
          }
          value={props.value}
          onChange={(e) => {
            props.setValue(e.target.value);
          }}
        />
      ) : (
        <input
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          className={
            "input input-bordered " +
            (props.hint.shown ? "input-" + props.hint.type : "")
          }
          value={props.value}
          onChange={(e) => {
            props.setValue(e.target.value);
          }}
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
