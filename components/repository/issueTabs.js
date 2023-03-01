import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

function RepositoryIssuesTabs({ repository, active, issueId, ...props }) {
  const [hrefBase, setHrefBase] = useState(
    "/" + repository.owner.id + "/" + repository.name + "/issues" + issueId
  );

  useEffect(() => {
    async function setHref() {
      setHrefBase(
        "/" + repository.owner.id + "/" + repository.name + "/issues/" + issueId
      );
    }
    setHref();
  }, [repository, props.user]);

  return (
    <div className="mt-8">
      <div className="tabs relative overflow-x-hidden overflow-y-hidden flex-nowrap z-10">
        <Link
          href={hrefBase}
          className={
            "tab tab-lifted" + (active === "conversation" ? " tab-active" : "")
          }
        >
          <span>Conversation</span>
        </Link>
        <Link
          href={hrefBase + "/bounties"}
          className={
            "tab tab-lifted" + (active === "bounties" ? " tab-active" : "")
          }
        >
          <span>Bounties</span>
        </Link>
        <Link
          href={hrefBase + "/pulls"}
          className={
            "tab tab-lifted " + (active === "linked-pulls" ? " tab-active" : "")
          }
        >
          <span>Linked Pull Requests</span>
        </Link>
      </div>
      <div className="border-b border-grey-50 relative -top-px z-0" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(RepositoryIssuesTabs);
