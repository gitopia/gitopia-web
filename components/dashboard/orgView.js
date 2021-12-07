import { connect } from "react-redux";
import { getOrganizationDetailsForDashboard } from "../../store/actions/organization";
import OrgViewTabs from "./orgViewTabs";

function OrgView({ organization = {}, ...props }) {
  const hrefBase = "/orgs/" + organization.address;
  return (
    <main className="container mx-auto max-w-screen-lg py-12">
      <div className="flex border-b border-grey">
        <div className="text-base text-type-secondarypy-2">Gitopia</div>
        <div className="ml-auto">
          <OrgViewTabs active="repositories" hrefBase={hrefBase} />
        </div>
      </div>
      <div className="text-left px-5 pt-10 font-style: italic text-base">
        <h2>Not Yet Implemented</h2>
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
