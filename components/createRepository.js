import { useState } from "react";
import { connect } from "react-redux";
import { createRepository } from "../store/actions/env";
import TextInput from "./textInput";
import { useApiClient } from "../context/ApiClientContext";

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
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
  };

  const validateRepository = () => {
    hideHints();
    if (name === "") {
      setNameHint({
        ...nameHint,
        shown: true,
        message: "Please enter a repository name",
      });
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
      let res = await props.createRepository(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          name,
          description,
        }
      );
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
    <div className="w-full">
      {repositoryCreated ? (
        <div className="p-4">
          <h2 className="card-title">Repository Created Successfully</h2>
          <div className="modal-action">
            <a
              href="#"
              className="btn btn-primary"
              onClick={newCreateRepository}
            >
              Ok
            </a>
          </div>
        </div>
      ) : (
        <div className="p-4">
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
              multiline={true}
              value={description}
              setValue={setDescription}
              hint={descriptionHint}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={createRepository}>
              Create
            </button>
            <a href="#" className="btn btn-ghost" onClick={newCreateRepository}>
              Cancel
            </a>
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
