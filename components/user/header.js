import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getUserDetailsForSelectedAddress } from "../../store/actions/user";
import getUserDaoAll from "../../helpers/getUserDaoAll";
import { notify } from "reapop";
import AccountAvatar from "../account/avatar";
import UserBio from "./bio";
import UserName from "./name";
import UserUsername from "./username";
import { async } from "regenerator-runtime";

function UserHeader(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [daos, setDaos] = useState([]);
  const [daosLength, setDaosLength] = useState(0);

  const refresh = async (updatedUserName) => {
    await props.refresh(updatedUserName);
    await props.getUserDetailsForSelectedAddress();
  };

  useEffect(() => {
    async function getDaos() {
      const daos = await getUserDaoAll(props.user.creator);
      if (daos?.length > 0) {
        setDaosLength(daos.length);
        setDaos(daos);
        if (daosLength > 2) {
          setDaos([daos[0], daos[1]]);
        }
      }
    }
    getDaos();
  });

  useEffect(() => {
    //  setIsEditable(props.user.creator === props.selectedAddress);
  }, [props.user.creator, props.selectedAddress]);

  return (
    <div className="flex flex-col sm:flex-row mb-8 items-start">
      <div className="">
        <AccountAvatar
          user={props.user}
          isEditable={isEditable}
          refresh={refresh}
        />
        <div className="grid justify-items-center">
          <UserUsername
            user={props.user}
            isEditable={isEditable}
            refresh={refresh}
          />
        </div>
      </div>
      <div className="flex-1 sm:pl-12 w-full max-w-2xl">
        <div className="text-xl mb-4">About</div>
        <UserName user={props.user} isEditable={isEditable} refresh={refresh} />
        <div className="text-type-secondary mb-4 flex">
          <a
            href={
              process.env.NEXT_PUBLIC_EXPLORER_URL +
              "/accounts/" +
              props.user.creator
            }
            target="_blank"
            rel="noreferrer"
            className="inline-block sm:inline link no-underline hover:link-primary text-type-secondary w-80 sm:w-full overflow-hidden break-words"
          >
            {props.user.creator}
          </a>
        </div>
        <UserBio user={props.user} isEditable={isEditable} refresh={refresh} />
      </div>

      <div className="flex flex-col items-start">
        {daos?.length > 0 ? (
          <div>
            <div className="text-xl">Daos</div>
            <div className="flex mt-4">
              {daos.map((dao) => {
                return (
                  <a className="flex" key={dao.id} href={"/" + dao.name}>
                    <div className="avatar flex-none mr-2 items-center">
                      <div className={"w-9 h-9 rounded-full"}>
                        <img
                          src={
                            "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                            dao.name.slice(0)
                          }
                        />
                      </div>
                    </div>
                  </a>
                );
              })}
              {daosLength > 2 ? (
                <div className="rounded-full bg-grey w-9 h-9 flex items-center justify-center">
                  {daosLength - 2}+
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {isEditable ? (
          <button
            className="flex-1 link no-underline uppercase mt-8 font-semibold text-green text-sm"
            onClick={() => {
              setIsEditable(false);
            }}
          >
            Done
          </button>
        ) : (
          <>
            {props.user.creator === props.selectedAddress ? (
              <button
                className="link no-underline uppercase text-green mt-8 font-semibold text-sm"
                onClick={() => {
                  setIsEditable(true);
                }}
              >
                Edit Profile
              </button>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  getUserDetailsForSelectedAddress,
  notify,
})(UserHeader);
