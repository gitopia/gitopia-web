import { useState, useEffect } from "react";
import { connect } from "react-redux";
import getUserDaoAll from "../../helpers/getUserDaoAll";
import { notify } from "reapop";
import AccountAvatar from "../account/avatar";
import AccountCard from "../account/card";
import UserBio from "./bio";
import UserName from "./name";
import UserUsername from "./username";
import { useApiClient } from "../../context/ApiClientContext";

function UserHeader(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [daos, setDaos] = useState([]);
  const { apiClient } = useApiClient();

  const refresh = async (updatedUserName) => {
    await props.refresh(updatedUserName);
  };

  useEffect(() => {
    async function getDaos() {
      const daos = await getUserDaoAll(apiClient, props.user.creator);
      setDaos(daos);
    }
    getDaos();
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
              "/account/" +
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
          <div className="mb-8">
            <div className="text-xl">Daos</div>
            <div className="flex mt-4 gap-1">
              {daos.map((dao, index) => {
                return index < 2 ? (
                  <div key={dao.id}>
                    <AccountCard
                      id={dao.address}
                      showAvatar={true}
                      showId={false}
                    />
                  </div>
                ) : (
                  ""
                );
              })}
              {daos?.length > 2 ? (
                <div className="rounded-full bg-grey w-9 h-9 flex items-center justify-center">
                  {daos?.length - 2}+
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
            className="flex-1 link no-underline uppercase font-semibold text-green text-sm"
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
                className="link no-underline uppercase text-green font-semibold text-sm"
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
  notify,
})(UserHeader);
