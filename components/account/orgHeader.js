import { useState, useEffect } from "react";

function AccountOrgHeader(props) {
  const [avatarLink, setAvatarLink] = useState("");

  const updateAvatar = async () => {
    let letter = "x";
    if (props.org.id) {
      letter = props.org.name.slice(0, 1);
    }
    const link =
      process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === props.org.address
        ? "/logo-g.svg"
        : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
          letter;
    setAvatarLink(link);
  };

  useEffect(updateAvatar, [props.org]);

  return (
    <div className="flex flex-1 mb-8">
      <div className="avatar flex-none mr-8 items-center">
        <div className={"w-40 h-40 rounded-md"}>
          <img src={avatarLink} />
        </div>
      </div>
      <div className="flex-1">
        <div className="text-md">{props.org.name}</div>
        <div className="text-sm text-type-secondary mt-2">
          {props.org.description}
        </div>
      </div>
    </div>
  );
}

export default AccountOrgHeader;
