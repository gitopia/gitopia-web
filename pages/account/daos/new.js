import { useState } from "react";
import { connect } from "react-redux";
import { createDao } from "../../../store/actions/dao";

import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../../components/header";
import TextInput from "../../../components/textInput";
import Footer from "../../../components/footer";
import OrgAvatar from "../../../components/dao/avatar";
import getUserDaoAll from "../../../helpers/getUserDaoAll";

function NewDao(props) {
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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [location, setLocation] = useState("");
  const [locationHint, setLocationHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [websiteHint, setWebsiteHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [daoCreating, setDaoCreating] = useState(false);

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
  };

  const validateDao = async () => {
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
    const daos = await getUserDaoAll(props.selectedAddress);
    daos.every((o) => {
      if (o.name === name) {
        alreadyAvailable = true;
        return false;
      }
      return true;
    });
    if (alreadyAvailable) {
      setNameHint({
        type: "error",
        shown: true,
        message: "DAO name already taken",
      });
      return false;
    }
    // if (description === "") {
    //   setDescriptionHint({
    //     ...descriptionHint,
    //     shown: true,
    //     message: "Please enter a description",
    //   });
    //   return false;
    // }
    return true;
  };

  const createDao = async () => {
    setDaoCreating(true);
    if (validateDao()) {
      let res = await props.createDao({
        name: name.replace(sanitizedNameTest, "-"),
        description,
        avatarUrl,
        location,
        website,
      });
      if (res && res.url) {
        router.push(res.url);
      }
    }
    setDaoCreating(false);
  };

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>New DAO - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <main className="container mx-auto max-w-md py-12 px-4 sm:px-0">
          <div className="text-2xl">Create a new DAO</div>
          <div className="mt-4">
            <OrgAvatar
              org={{ name, avatarUrl }}
              isEditable={true}
              callback={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
            />
          </div>
          <div className="mt-4">
            <TextInput
              type="text"
              label="Name"
              name="dao_name"
              placeholder="DAO Name"
              value={name}
              setValue={(v) => {
                if (sanitizedNameTest.test(v)) {
                  setNameHint({
                    type: "info",
                    shown: true,
                    message:
                      "Your DAO would be named as " +
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
              label="Description"
              name="dao_description"
              placeholder="Description"
              multiline={true}
              value={description}
              setValue={setDescription}
              hint={descriptionHint}
            />
          </div>
          <div className="mt-4">
            <TextInput
              type="text"
              label="Website"
              name="dao_website"
              placeholder="Website"
              value={website}
              setValue={setWebsite}
              hint={websiteHint}
            />
          </div>
          <div className="mt-4">
            <TextInput
              type="text"
              label="Location"
              name="dao_location"
              placeholder="Location"
              value={location}
              setValue={setLocation}
              hint={locationHint}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              className={
                "flex-none btn btn-primary btn-wide " +
                (daoCreating ? "loading " : "")
              }
              disabled={daoCreating}
              onClick={createDao}
            >
              Create DAO
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  createDao,
})(NewDao);
