import { useEffect, useState } from "react";
import TextInput from "../textInput";
import { connect } from "react-redux";
import { renameRepository } from "../../store/actions/repository";
import isRepositoryNameTaken from "../../helpers/isRepositoryNameTaken";

function RenameRepository({
  repoId = null,
  repoOwner = null,
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
  const [startRename, setStartRename] = useState(false);
  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  useEffect(() => {
    setName(currentName);
    setNameHint({ shown: false });
  }, [currentName]);

  const validateName = async () => {
    if (name.length < 3) {
      setNameHint({
        type: "error",
        shown: true,
        message: "Repository name must have atleat 3 characters",
      });
      return false;
    }
    const alreadyAvailable = await isRepositoryNameTaken(name, repoOwner);
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
    if (await validateName()) {
      const res = await props.renameRepository({
        id: repoId,
        name: name.replace(sanitizedNameTest, "-"),
      });
      if (res) {
        if (onSuccess) await onSuccess(name.replace(sanitizedNameTest, "-"));
      }
    }
    setIsChanging(false);
    setStartRename(false);
  };

  return startRename ? (
    <div className="sm:flex items-top">
      <div className="flex-1 mr-8">
        <TextInput
          type="text"
          name="repository_name"
          placeholder="Repository Name"
          label="Rename Repository"
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
      <div className="flex-none w-48 pt-4 sm:pt-9">
        <button
          className={
            "btn btn-sm btn-block btn-outline " + (isChanging ? "loading" : "")
          }
          disabled={name === currentName || name.trim() === "" || isChanging}
          onClick={changeName}
        >
          Rename
        </button>
      </div>
    </div>
  ) : (
    <div className="sm:flex items-center">
      <div className="flex-1 mr-8">
        <div className="label-text">Rename Repository</div>
        <div className="label-text-alt text-type-secondary">
          The remote url will also change and anyone using current repository
          will have to update their settings
        </div>
      </div>
      <div className="flex-none w-48 pt-4 sm:pt-0">
        <button
          className="btn btn-sm btn-block btn-accent btn-outline"
          onClick={() => setStartRename(true)}
        >
          Rename
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
    dashboards: state.user.dashboards,
  };
};

export default connect(mapStateToProps, {
  renameRepository,
})(RenameRepository);
