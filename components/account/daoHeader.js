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
import DaoLocation from "../dao/location";
import DaoWebsite from "../dao/website";
import getDaoMember from "../../helpers/getUserDaoMember";

function AccountDaoHeader(props) {
  const [isEditable, setIsEditable] = useState(false);

  const refresh = async (updatedDaoName) => {
    await props.refresh(updatedDaoName);
    await props.getDaoDetailsForDashboard();
  };

  useEffect(() => {
    async function getMembers() {
      const members = await getDaoMember(props.dao.address);
      setIsEditable(await props.isCurrentUserEligibleToUpdate(members));
    }
    getMembers();
  }, [props.dao.address, props.selectedAddress]);

  return (
    <div className="flex flex-col sm:flex-row mb-8 items-start">
      <AccountAvatar
        dao={props.dao}
        isEditable={isEditable}
        refresh={refresh}
        isDao={true}
      />
      <div className="flex-1 max-w-3xl sm:pl-12">
        <DaoName dao={props.dao} isEditable={isEditable} refresh={refresh} />
        <div className="text-type-secondary mb-4">
          <span className="inline-block">
            {"@" + props.dao.name.toLowerCase()}
          </span>
          <span className="mx-2 hidden sm:inline">&middot;</span>
          <a
            href={
              process.env.NEXT_PUBLIC_EXPLORER_URL +
              "/accounts/" +
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
          isEditable={isEditable}
          refresh={refresh}
        />
        <div className="text-sm text-type-secondary mt-2 flex flex-col sm:flex-row gap-2">
          <DaoLocation
            dao={props.dao}
            isEditable={isEditable}
            refresh={refresh}
          />
          <DaoWebsite
            dao={props.dao}
            isEditable={isEditable}
            refresh={refresh}
          />
        </div>
      </div>
    </div>
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
