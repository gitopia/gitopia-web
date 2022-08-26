import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getDaoDetailsForDashboard,
  isCurrentUserEligibleToUpdate,
} from "../../store/actions/dao";
import { notify } from "reapop";
import DaoDescription from "../dao/description";
import DaoAvatar from "../dao/avatar";
import DaoLocation from "../dao/location";
import DaoWebsite from "../dao/website";
import getDaoMember from "../../helpers/getUserDaoMember";

function AccountDaoHeader(props) {
  const [isEditable, setIsEditable] = useState(false);

  const refresh = async () => {
    await props.refresh();
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
        <div className="text-2xl py-1 mb-1 border-b border-transparent">
          {props.dao.name}
        </div>
        <DaoDescription
          dao={props.dao}
          isEditable={isEditable}
          refresh={refresh}
        />
        <div className="text-sm text-type-secondary mt-2 flex gap-2">
          {/* <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{props.dao.location}</span>
          </div> */}
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
