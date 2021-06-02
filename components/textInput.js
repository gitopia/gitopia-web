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
  }
) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{props.label}</span>
      </label>
      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        className={
          "input input-primary input-bordered " +
          (props.hint.shown ? "input-" + props.hint.type : "")
        }
        value={props.value}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
      />
      {props.hint.shown && (
        <label className="label">
          <span className="label-text-alt">{props.hint.message}</span>
        </label>
      )}
    </div>
  );
}
