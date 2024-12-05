import { CheckCircle2, XCircle, AlertCircle, Timer } from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PROPOSAL_STATUS_ACCEPTED: {
      icon: CheckCircle2,
      label: "Accepted",
      className: "bg-success/10 text-success border-success/20",
    },
    PROPOSAL_STATUS_REJECTED: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-error/10 text-error border-error/20",
    },
    PROPOSAL_STATUS_SUBMITTED: {
      icon: Timer,
      label: "Active",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    default: {
      icon: AlertCircle,
      label: "Unknown",
      className: "bg-muted/10 text-muted-foreground border-muted/20",
    },
  };

  const config = statusConfig[status] || statusConfig.default;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </div>
  );
};

export default StatusBadge;
