import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

function RepositoryIssuesTabs({ repository, active, issueId, ...props }) {
  const [hrefBase, setHrefBase] = useState(
    "/" + repository.owner.id + "/" + repository.name + "/issues" + issueId
  );

  useEffect(async () => {
    setHrefBase(
      "/" + repository.owner.id + "/" + repository.name + "/issues/" + issueId
    );
  }, [repository, props.user]);

  return (
    <div className="mt-8">
      <div className="tabs relative z-10">
        <Link href={hrefBase}>
          <a
            className={
              "tab tab-lifted" +
              (active === "conversation" ? " tab-active" : "")
            }
          >
            <span>Conversation</span>
          </a>
        </Link>
        <Link href={hrefBase + "/bounties"}>
          <a
            className={
              "tab tab-lifted" + (active === "bounties" ? " tab-active" : "")
            }
          >
            <span>Bounties</span>
          </a>
        </Link>
      </div>
      <div className="border-b border-grey relative -top-px z-0" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(RepositoryIssuesTabs);
