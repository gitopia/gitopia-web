import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getDaoDetailsForDashboard,
  isCurrentUserEligibleToUpdate,
} from "../../store/actions/dao";
import { notify } from "reapop";
import OrgDescription from "../dao/description";
import OrgAvatar from "../dao/avatar";
import OrgLocation from "../dao/location";
import OrgWebsite from "../dao/website";
import getDaoMember from "../../helpers/getUserDaoMember";

function AccountOrgHeader(props) {
  const [isEditable, setIsEditable] = useState(false);

  const refresh = async () => {
    await props.refresh();
    await props.getDaoDetailsForDashboard();
  };

  useEffect(async () => {
    const members = await getDaoMember(props.org.address);
    setIsEditable(await props.isCurrentUserEligibleToUpdate(members));
  }, [props.org.address, props.selectedAddress]);

  return (
    <div className="flex flex-1 mb-8 items-start">
      <OrgAvatar org={props.org} isEditable={isEditable} refresh={refresh} />
      <div className="flex-1 max-w-xl pl-12">
        <div className="text-2xl py-1 mb-1 border-b border-transparent">
          {props.org.name}
        </div>
        <OrgDescription
          org={props.org}
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
            <span>{props.org.location}</span>
          </div> */}
          <OrgLocation
            org={props.org}
            isEditable={isEditable}
            refresh={refresh}
          />
          <OrgWebsite
            org={props.org}
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
})(AccountOrgHeader);
