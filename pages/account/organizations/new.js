import { useState } from "react";
import { connect } from "react-redux";
import { createOrganization } from "../../../store/actions/organization";

import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../../components/header";
import TextInput from "../../../components/textInput";
import Footer from "../../../components/footer";

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
  const [organizationCreating, setOrganizationCreating] = useState(false);

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
  };

  const validateOrganization = () => {
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
    props.organizations.every((o) => {
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
        message: "Organization name already taken",
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

  const createOrganization = async () => {
    setOrganizationCreating(true);
    if (validateOrganization()) {
      let res = await props.createOrganization({
        name: name.replace(sanitizedNameTest, "-"),
        description,
      });
      if (res && res.url) {
        router.push(res.url);
      }
    }
    setOrganizationCreating(false);
  };

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>New Organization - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <main className="container mx-auto max-w-md py-12">
          <div className="text-2xl">Create a new organization</div>
          <div className="mt-4">
            <TextInput
              type="text"
              label="Organization Name"
              name="organization_name"
              placeholder="Organization Name"
              value={name}
              setValue={(v) => {
                if (sanitizedNameTest.test(v)) {
                  setNameHint({
                    type: "info",
                    shown: true,
                    message:
                      "Your organization would be named as " +
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
              label="Organization Description"
              name="organization_description"
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
                (organizationCreating ? "loading " : "")
              }
              onClick={createOrganization}
            >
              Create Organization
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
    organizations: state.user.organizations,
  };
};

export default connect(mapStateToProps, {
  createOrganization,
})(NewOrganization);
