import { useState } from "react";
import * as bip39 from "bip39";
import { connect } from "react-redux";
import { createRepository } from "../store/actions/repository";
import TextInput from "./textInput";

function CreateRepository(props) {
  const [name, setName] = useState("");
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [description, setDescription] = useState("");
  const [descriptionHint, setDescriptionHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [repositoryCreated, setRepositoryCreated] = useState(false);

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
  };

  const validateRepository = () => {
    hideHints();
    if (name === "") {
      setNameHint({ ...nameHint, shown: true, message: "Please enter a repository name" });
      return false;
    }
    let alreadyAvailable = false;
    props.repositorys.every((repository) => {
      if (repository.name === name) {
        alreadyAvailable = true;
        return false;
      }
    });
    if (alreadyAvailable) {
      setNameHint({
        ...nameHint,
        shown: true,
        message: "Repository name already taken",
      });
      return false;
    }
    if (description === "") {
      setDescriptionHint({
        ...descriptionHint,
        shown: true,
        message: "Please enter a description",
      });
      return false;
    }
    return true;
  };

  const createRepository = async () => {
    if (validateRepository()) {
      let res = await props.createRepository({
        name,
        description
      });
      console.log(res);
      setRepositoryCreated(true);
    }
  };

  const newCreateRepository = () => {
    hideHints();
    setName("");
    setDescription("");
    setRepositoryCreated(false);
  };

  return (
    <div className="card lg:card-side inline-block shadow bordered max-w-xs w-full">
      {repositoryCreated ? (
        <div className="card-body">
          <h2 className="card-title">Repository Created Successfully</h2>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={newCreateRepository}>
              Ok
            </button>
          </div>
        </div>
      ) : (
        <div className="card-body">
          <h2 className="card-title">Create Repository</h2>
          <div className="form-control mb-1">
            <TextInput
              type="text"
              name="repository_name"
              placeholder="Repository Name"
              value={name}
              setValue={setName}
              hint={nameHint}
            />
          </div>
          <div className="form-control">
            <TextInput
              type="text"
              name="repository_description"
              placeholder="Description"
              className="input input-primary input-bordered"
              value={description}
              setValue={setDescription}
              hint={descriptionHint}
            />
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={createRepository}>
              Create
            </button>
            <button className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    repositorys: state.repository.repositorys,
  };
};

export default connect(mapStateToProps, {
  createRepository,
})(CreateRepository);
