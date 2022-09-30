import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getDaoDetailsForDashboard,
  isCurrentUserEligibleToUpdate,
} from "../../store/actions/dao";
import { notify } from "reapop";
import DaoName from "../dao/name";
import DaoDescription from "../dao/description";
import DaoAvatar from "../dao/avatar";
import DaoLocation from "../dao/location";
import DaoWebsite from "../dao/website";
import getDaoMember from "../../helpers/getUserDaoMember";

function AccountDaoHeader(props) {
  const [isEditable, setIsEditable] = useState(false);

  const refresh = async (updatedDaoName) => {
    await props.refresh(updatedDaoName);
    await props.getDaoDetailsForDashboard();
  };

  useEffect(async () => {
    const members = await getDaoMember(props.dao.address);
    setIsEditable(await props.isCurrentUserEligibleToUpdate(members));
  }, [props.dao.address, props.selectedAddress]);

  return (
    <div className="flex flex-1 mb-8 items-start">
      <DaoAvatar dao={props.dao} isEditable={isEditable} refresh={refresh} />
      <div className="flex-1 max-w-xl pl-12">
        <DaoName dao={props.dao} isEditable={isEditable} refresh={refresh} />
        <div className="mb-2 text-type-secondary">{props.dao.address}</div>
        <DaoDescription
          dao={props.dao}
          isEditable={isEditable}
          refresh={refresh}
        />
        <div className="text-sm text-type-secondary mt-2 flex gap-2">
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
