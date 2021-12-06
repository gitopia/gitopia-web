import Link from "next/link";
import { connect } from "react-redux";
import MembersList from "./membersList";
import { getOrganizationDetailsForDashboard } from "../../store/actions/organization";

function OrgView({ organization = {}, ...props }) {
  return (
    <main className="container mx-auto max-w-screen-lg py-12">
      <div className="text-base text-type-secondary mx-8 border-b border-grey py-2 mb-4">
        Gitopia
      </div>
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, { getOrganizationDetailsForDashboard })(
  OrgView
);
