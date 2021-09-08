import { useEffect, useState } from "react";
import TextInput from "../textInput";
import { connect } from "react-redux";
import { renameRepository } from "../../store/actions/repository";

function RenameRepository({
  repoId = null,
  currentName = "",
  onSuccess,
  ...props
}) {
  const [name, setName] = useState(currentName);
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [isChanging, setIsChanging] = useState(false);
  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  useEffect(() => {
    setName(currentName);
    setNameHint({ shown: false });
  }, [currentName]);

  const validateName = () => {
    if (name.length < 3) {
      setNameHint({
        type: "error",
        shown: true,
        message: "Repository name must have atleat 3 characters",
      });
      return false;
    }
    let alreadyAvailable = false,
      sanitizedName = name.replace(sanitizedNameTest, "-");
    props.repositories.every((r) => {
      if (r.name === sanitizedName) {
        alreadyAvailable = true;
        return false;
      }
      return true;
    });
    if (alreadyAvailable) {
      setNameHint({
        type: "error",
        shown: true,
        message: "Repository name already taken",
      });
      return false;
    }
    return true;
  };

  const changeName = async () => {
    setIsChanging(true);
    const res = await props.renameRepository({
      id: repoId,
      name: name.replace(sanitizedNameTest, "-"),
    });
    if (res) {
      if (onSuccess) await onSuccess(name.replace(sanitizedNameTest, "-"));
    }
    setIsChanging(false);
  };

  return (
    <div className="flex items-top">
      <div className="flex-1 py-2 mr-8">
        <TextInput
          type="text"
          name="repository_name"
          placeholder="Repository Name"
          value={name}
          setValue={(v) => {
            if (sanitizedNameTest.test(v)) {
              setNameHint({
                type: "info",
                shown: true,
                message:
                  "Your repository would be named as " +
                  v.replace(sanitizedNameTest, "-"),
              });
            } else {
              setNameHint({ shown: false });
            }
            setName(v);
          }}
          hint={nameHint}
          size="sm"
        />
      </div>
      <div className="flex-none w-52 pt-2">
        <button
          className={
            "btn btn-sm btn-block btn-outline " + (isChanging ? "loading" : "")
          }
          disabled={name === currentName || name.trim() === ""}
          onClick={changeName}
        >
          Change Name
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  renameRepository,
})(RenameRepository);
