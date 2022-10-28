import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createRepository } from "../store/actions/repository";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/header";
import TextInput from "../components/textInput";
import shrinkAddress from "../helpers/shrinkAddress";
import Footer from "../components/footer";
import isRepositoryNameTaken from "../helpers/isRepositoryNameTaken";

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
  const [ownerId, setOwnerId] = useState(props.name);
  const [repositoryCreating, setRepositoryCreating] = useState(false);
  const [accountsList, setAccountsList] = useState([
    { value: "", display: "" },
  ]);

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  useEffect(() => {
    setAccountsList([...props.dashboards]);
    setOwnerId(props.name);
  }, [props.dashboards, props.name]);

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
  };

  const validateRepository = async () => {
    hideHints();
    if (name === "") {
      setNameHint({
        type: "error",
        shown: true,
        message: "Please enter a repository name",
      });
      return false;
    }
    if (name.length < 3) {
      setNameHint({
        type: "error",
        shown: true,
        message: "Repository name must have atleat 3 characters",
      });
      return false;
    }
    const alreadyAvailable = await isRepositoryNameTaken(name, ownerId);

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

  const createRepository = async () => {
    setRepositoryCreating(true);
    if (await validateRepository()) {
      console.log("create Repo", {
        name: name.replace(sanitizedNameTest, "-"),
        description,
        ownerId,
      });
      let res = await props.createRepository({
        name: name.replace(sanitizedNameTest, "-"),
        description,
        ownerId,
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
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>New Repository - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg min-h-full py-12 px-4 sm:px-0">
          <div className="text-2xl">Create a new repository</div>
          <div className="flex justify-between mt-4">
            <div className="w-3/4 text-sm">
              Your repository will be created on the blockchain, meaning it will
              outlive even you once it’s created. You can archive repositories,
              but they will still be visible to the public.
            </div>
            {/* <div className="w-96 text-sm text-right">
              Already have a repository? You can{" "}
              <a className="text-primary">import it </a>
              here.
            </div> */}
          </div>
          <div className="bg-box-grad-v rounded-md mt-4 flex justify-center">
            <img src="new-repository.svg" className="h-58" />
          </div>
          <div className="mt-4">
            <div className="flex items-top">
              <div className="form-control flex-1 sm:mr-12">
                <label className="label">
                  <span className="label-text">Repository Owner</span>
                </label>
                <select
                  className="select select-bordered select-md mr-2 sm:mr-0"
                  value={ownerId}
                  onChange={(e) => {
                    console.log("onchange");
                    setOwnerId(e.target.value);
                  }}
                >
                  {accountsList.map((a, i) => {
                    return (
                      <option value={a.name} key={i}>
                        {a.name + " - " + shrinkAddress(a.id)}
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
                className="flex-1 w-10"
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
                  "flex-none btn btn-primary btn-wide " +
                  (repositoryCreating ? "loading " : "")
                }
                disabled={repositoryCreating}
                onClick={createRepository}
              >
                Create Repository
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    dashboards: state.user.dashboards,
    name: state.wallet.activeWallet.isKeplr
      ? state.wallet.activeWallet?.accounts[0].address
      : state.wallet.activeWallet?.name,
  };
};

export default connect(mapStateToProps, {
  createRepository,
})(NewRepository);
