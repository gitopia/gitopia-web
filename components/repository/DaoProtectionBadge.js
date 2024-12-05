import React, { useState } from "react";
import {
  Shield,
  GitPullRequest,
  Tags,
  Trash2,
  Users as UsersIcon,
  Info,
  Check,
  X,
} from "lucide-react";

const DAOProtectionBadge = ({ enabledFeatures, governanceFeatures }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const totalFeatures = governanceFeatures.length;
  const protectionLevel =
    enabledFeatures === 0
      ? "none"
      : enabledFeatures === totalFeatures
      ? "full"
      : "partial";

  const getBadgeColors = (level) => {
    switch (level) {
      case "full":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-400",
          icon: "text-green-400",
        };
      case "partial":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          text: "text-yellow-400",
          icon: "text-yellow-400",
        };
      default:
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-400",
          icon: "text-red-400",
        };
    }
  };

  const colors = getBadgeColors(protectionLevel);

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${colors.bg} ${colors.border} cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Shield
          size={14}
          className={colors.icon}
          fill="currentColor"
          fillOpacity={0.2}
        />
        <span className={`${colors.text} font-medium`}>
          {protectionLevel === "full" && "Fully Protected"}
          {protectionLevel === "partial" && "Partially Protected"}
          {protectionLevel === "none" && "Unprotected"}
        </span>
        {/* <span className={`text-xs ${colors.text} opacity-75`}>
          ({enabledFeatures}/{totalFeatures})
        </span> */}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-80 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-50">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
              <Info size={14} className="text-gray-400" />
              <span className="font-medium text-gray-200">
                DAO Protection Status
              </span>
            </div>

            {/* Feature List */}
            <div className="space-y-2">
              {governanceFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm group"
                >
                  <div className="flex items-center gap-2 min-w-[20px]">
                    {feature.enabled ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <X size={14} className="text-red-400" />
                    )}
                    <feature.icon
                      size={14}
                      className={`text-gray-400 transition-opacity ${
                        feature.enabled
                          ? "group-hover:opacity-100"
                          : "group-hover:opacity-50"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-200">
                      {feature.label}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
              <div className="flex items-start gap-2">
                <Shield size={14} className="mt-0.5 shrink-0" />
                <span>
                  DAO protection requires member voting for critical repository
                  actions.
                  {protectionLevel === "none" &&
                    " Currently, no protections are enabled."}
                  {protectionLevel === "partial" &&
                    " Some critical actions still don't require approval."}
                  {protectionLevel === "full" &&
                    " All critical actions require DAO approval."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DAOProtectionBadge;
