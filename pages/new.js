import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createRepository } from "../store/actions/repository";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/header";
import TextInput from "../components/textInput";
import shrinkAddress from "../helpers/shrinkAddress";

function NewRepository(props) {
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
  const [owner, setOwner] = useState("");
  const [repositoryCreating, setRepositoryCreating] = useState(false);
  const [accountsList, setAccountsList] = useState([
    { value: "", display: "" },
  ]);

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  useEffect(() => {
    let newAccountsList = [];
    if (props.address) {
      const item = {
        value: JSON.stringify({ Type: "User", ID: props.address }),
        display: props.activeWallet.name + " - " + shrinkAddress(props.address),
      };
      newAccountsList.push(item);
    }
    if (props.organizations.length) {
      for (let i = 0; i < props.organizations.length; i++) {
        newAccountsList.push({
          value: JSON.stringify({
            Type: "Organization",
            ID: props.organizations[i],
          }),
          display: "Org - " + props.organizations[i],
        });
      }
    }
    if (accountsList.length) {
      setOwner(accountsList[0].value);
    } else {
      setOwner("");
    }
    setAccountsList(newAccountsList);
  }, [props.address, props.organizations]);

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
        message: "Please enter a repository name",
      });
      return false;
    }
    if (props.repositoryNames[name]) {
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
      let res = await props.createRepository({
        name: name.replace(sanitizedNameTest, "-"),
        description,
        owner,
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
        <title>New Repository - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex">
        <main className="container mx-auto max-w-screen-lg py-12">
          <div className="text-2xl">Create a new repository</div>
          <div className="flex justify-between mt-4">
            <div className="w-96 text-sm">
              Your repository will be created on the blockchain, meaning it will
              outlive even you once it’s created. You can archive repositories,
              but they will still be visible to the public.
            </div>
            <div className="w-96 text-sm text-right">
              Already have a repository? You can{" "}
              <a className="text-primary">import it </a>
              here.
            </div>
          </div>
          <div className="bg-box-grad-v rounded-md mt-4 flex justify-center">
            <img src="new-repository.svg" className="h-58" />
          </div>
          <div className="mt-4">
            <div className="flex items-top">
              <div className="form-control flex-1 mr-12">
                <label className="label">
                  <span className="label-text">Repository Owner</span>
                </label>
                <select
                  className="select select-bordered select-md"
                  value={owner}
                  onChange={(e) => {
                    setOwner(e.target.value);
                  }}
                >
                  {accountsList.map((a, i) => {
                    return (
                      <option value={a.value} key={i}>
                        {a.display}
                      </option>
                    );
                  })}
                </select>
              </div>

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
                className="flex-1"
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
                Create Repository
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    repositoryNames: state.user.repositoryNames,
    address: state.wallet.selectedAddress,
    activeWallet: state.wallet.activeWallet,
    organizations: state.user.organizations,
  };
};

export default connect(mapStateToProps, {
  createRepository,
})(NewRepository);
