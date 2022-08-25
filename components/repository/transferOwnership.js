import { useEffect, useState } from "react";
import TextInput from "../textInput";
import { connect } from "react-redux";
import { changeRepositoryOwner } from "../../store/actions/repository";
import getUser from "../../helpers/getUser";
import getOrganization from "../../helpers/getOrganization";
import getAnyRepositoryAll from "../../helpers/getAnyRepositoryAll";

function TransferOwnership({
  repoId = null,
  repoName = "",
  currentOwnerId = "",
  onSuccess,
  ...props
}) {
  const [address, setAddress] = useState("");
  const [addressHint, setAddressHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [isChanging, setIsChanging] = useState(false);
  const [startTransfer, setStartTransfer] = useState(false);
  const validAddress = new RegExp("gitopia[a-z0-9]{39}");

  useEffect(() => {
    setAddress("");
    setAddressHint({ shown: false });
  }, [currentOwnerId]);

  const validateAddress = async () => {
    setAddressHint({
      shown: false,
    });
    /*
      if (!validAddress.test(address)) {
      setAddressHint({
        type: "error",
        shown: true,
        message: "Invalid address",
      });
      return [false, null];
    }
    */
    let alreadyAvailable = false;
    //   sanitizedName = name.replace(sanitizedNameTest, "-");
    // props.repositories.every((r) => {
    //   if (r.name === sanitizedName) {
    //     alreadyAvailable = true;
    //     return false;
    //   }
    //   return true;
    // });
    //
    let ownerType = null;
    let [user, org] = await Promise.all([
      getUser(address),
      getOrganization(address),
    ]);
    console.log("user tranfer ownership", user);
    if (user) {
      console.log("user exists", user);
      ownerType = "USER";
      const repositories = await getAnyRepositoryAll(address);
      repositories.every((r) => {
        if (r.name === repoName) {
          alreadyAvailable = true;
          return false;
        }
        return true;
      });
    } else if (org) {
      console.log("org exists", org);
      ownerType = "ORGANIZATION";
      const repositories = await getAnyRepositoryAll(address);
      repositories.every((r) => {
        if (r.name === repoName) {
          alreadyAvailable = true;
          return false;
        }
        return true;
      });
    } else {
      setAddressHint({
        type: "error",
        shown: true,
        message: "Address is not registered on chain",
      });
      return [false, null];
    }
    if (alreadyAvailable) {
      setAddressHint({
        type: "error",
        shown: true,
        message: "Repository name already taken on this address",
      });
      return [false, null];
    }
    return [true, ownerType];
  };

  const transferRepository = async () => {
    setIsChanging(true);
    const [res, ownerType] = await validateAddress();
    if (res) {
      const res = await props.changeRepositoryOwner({
        repoName: repoName,
        repoOwner: currentOwnerId,
        owner: address,
      });
      if (res) {
        if (onSuccess) await onSuccess(address);
      }
    }
    setIsChanging(false);
  };

  return startTransfer ? (
    <div className="flex items-top">
      <div className="flex-1 mr-8">
        <TextInput
          type="text"
          name="owner_address"
          placeholder="New owner address"
          label="Transfer Ownership"
          value={address}
          setValue={setAddress}
          hint={addressHint}
          size="sm"
        />
      </div>
      <div className="flex-none w-48 pt-9">
        <button
          className={
            "btn btn-sm btn-block btn-outline " + (isChanging ? "loading" : "")
          }
          disabled={
            address === currentOwnerId || address.trim() === "" || isChanging
          }
          onClick={transferRepository}
        >
          Transfer
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center">
      <div className="flex-1 mr-8">
        <div className="label-text">Transfer Ownership</div>
        <div className="label-text-alt text-type-secondary">
          Transfer this repository to another user or to a DAO
        </div>
      </div>
      <div className="flex-none w-48">
        <button
          className="btn btn-sm btn-block btn-accent btn-outline"
          onClick={() => setStartTransfer(true)}
        >
          Transfer
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
  changeRepositoryOwner,
})(TransferOwnership);
