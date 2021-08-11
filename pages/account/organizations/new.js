import { useState } from "react";
import { connect } from "react-redux";
import { createOrganization } from "../../../store/actions/repository";

import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../../components/header";
import TextInput from "../../../components/textInput";

function NewOrganization(props) {
  const router = useRouter();
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
  const [repositoryCreating, setRepositoryCreating] = useState(false);

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
  };

  const validateRepository = () => {
    hideHints();
    if (name === "") {
      setNameHint({
        type: "error",
        shown: true,
        message: "Please enter a name",
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
        type: "error",
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
    setRepositoryCreating(true);
    if (validateRepository()) {
      let res = await props.createOrganization({
        name: name.replace(sanitizedNameTest, "-"),
        description,
      });
      if (res && res.url) {
        router.push(res.url);
      }
    }
    setRepositoryCreating(false);
  };

  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>New Organization - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex">
        <main className="container mx-auto max-w-md py-12">
          <div className="text-2xl">Create a new organization</div>
          <div className="mt-4">
            <TextInput
              type="text"
              label="Repository Name"
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
            />
          </div>
          <div className="mt-4">
            <TextInput
              type="text"
              label="Repository Description"
              name="repository_description"
              placeholder="Description"
              multiline={true}
              value={description}
              setValue={setDescription}
              hint={descriptionHint}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              className={
                "flex-none btn btn-primary " +
                (repositoryCreating ? "loading " : "")
              }
              onClick={createRepository}
            >
              Create Organization
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    repositorys: state.repository.repositorys,
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  createOrganization,
})(NewOrganization);
