import {
  Home,
  Box,
  Database,
  Users,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

export default function PublicTabs({
  hrefBase,
  active,
  showPeople = false,
  showProposal = false,
  ...props
}) {
  return (
    <div className="tabs overflow-x-auto overflow-y-hidden flex-nowrap">
      <Link
        href={hrefBase}
        className={
          "tab tab-md tab-bordered" +
          (active === "overview" ? " tab-active" : "")
        }
      >
        <span className="icon mr-2">
          <Home size={24} stroke="#ADBECB" />
        </span>
        <span>Overview</span>
      </Link>

      <Link
        href={hrefBase + "?tab=repositories"}
        className={
          "tab tab-md tab-bordered" +
          (active === "repositories" ? " tab-active" : "")
        }
        data-test="repositories_tab"
      >
        <span className="icon mr-2">
          <Box size={24} stroke="#ADBECB" />
        </span>
        <span>Repositories</span>
      </Link>

      {!showPeople ? (
        <Link
          href={hrefBase + "?tab=transactions"}
          className={
            "tab tab-md tab-bordered" +
            (active === "transactions" ? " tab-active" : "")
          }
        >
          <span className="icon mr-2">
            <Database size={24} stroke="#ADBECB" />
          </span>
          <span>Transactions</span>
        </Link>
      ) : null}

      {showPeople ? (
        <Link
          href={hrefBase + "?tab=people"}
          className={
            "tab tab-md tab-bordered" +
            (active === "people" ? " tab-active" : "")
          }
        >
          <span className="icon mr-2">
            <Users size={24} stroke="#ADBECB" />
          </span>
          <span>People</span>
        </Link>
      ) : null}

      <Link
        href={hrefBase + "?tab=proposals"}
        className={
          "tab tab-md tab-bordered" +
          (active === "proposals" ? " tab-active" : "")
        }
      >
        <span className="icon mr-2">
          <FileText size={24} stroke="#ADBECB" />
        </span>
        <span>Proposals</span>
      </Link>

      {showProposal ? (
        <Link
          href={hrefBase + "?tab=protocolproposals"}
          className={
            "tab tab-md tab-bordered" +
            (active === "protocolproposals" ? " tab-active" : "")
          }
        >
          <span className="icon mr-2">
            <ClipboardCheck size={24} stroke="#ADBECB" />
          </span>
          <span>Protocol Proposals</span>
        </Link>
      ) : null}
    </div>
  );
}
