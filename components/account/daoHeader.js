import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getDaoDetailsForDashboard,
  isCurrentUserEligibleToUpdate,
} from "../../store/actions/dao";
import { notify } from "reapop";
import DaoName from "../dao/name";
import DaoDescription from "../dao/description";
import AccountAvatar from "../account/avatar";
import DaoWebsite from "../dao/website";
import { useApiClient } from "../../context/ApiClientContext";
import DaoTreasuryStats from "./DaoTreasuryStats";

function AccountDaoHeader(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { apiClient, cosmosGroupApiClient } = useApiClient();

  const refresh = async (updatedDaoName) => {
    await props.refresh(updatedDaoName);
    await props.getDaoDetailsForDashboard(apiClient);
  };

  // disable editing of dao metadata from profile view
  // useEffect(() => {
  //   async function getMembers() {
  //     const members = await getGroupMembers(
  //       cosmosGroupApiClient,
  //       props.dao.group_id
  //     );
  //     setIsEditable(await props.isCurrentUserEligibleToUpdate(members));
  //   }
  //   getMembers();
  // }, [props.dao.address, props.selectedAddress]);

  return (
    <>
      <div className="flex flex-col sm:flex-row mb-8 items-start">
        <div>
          <AccountAvatar
            dao={props.dao}
            isEditable={isEditable}
            refresh={refresh}
            isDao={true}
          />
          <span className="grid justify-items-center">
            {props.dao.name.toLowerCase()}
          </span>
        </div>
        <div className="flex-1 max-w-3xl sm:pl-12">
          <div className="text-xl mb-4">About</div>
          <DaoName dao={props.dao} isEditable={isEditing} refresh={refresh} />
          <div className="text-type-secondary mb-4">
            <a
              href={
                process.env.NEXT_PUBLIC_EXPLORER_URL +
                "/account/" +
                props.dao.address
              }
              target="_blank"
              rel="noreferrer"
              className="inline-block sm:inline link no-underline hover:link-primary text-type-secondary w-80 sm:w-full overflow-hidden break-words"
            >
              {props.dao.address}
            </a>
          </div>
          <DaoDescription
            dao={props.dao}
            isEditable={isEditing}
            refresh={refresh}
          />
          <div className="text-sm text-type-secondary mt-2 flex flex-col sm:flex-row gap-2">
            <DaoWebsite
              dao={props.dao}
              isEditable={isEditing}
              refresh={refresh}
            />
          </div>
        </div>
        {isEditing ? (
          <button
            className="link no-underline uppercase font-semibold text-green text-sm"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Done
          </button>
        ) : (
          <>
            {isEditable ? (
              <button
                className="link no-underline uppercase text-green font-semibold text-sm"
                onClick={() => {
                  setIsEditing(true);
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

      {/* Add the treasury stats component */}
      <DaoTreasuryStats dao={props.dao} className="mb-8" />
    </>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  getDaoDetailsForDashboard,
  isCurrentUserEligibleToUpdate,
  notify,
})(AccountDaoHeader);
