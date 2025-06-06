import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Users } from "lucide-react";

const COLORS = [
  "#1fa1ff",
  "#ffab2e",
  "#893be7",
  "#2fe49c",
  "#3db9ff",
  "#ffbc57",
  "#9f5cf0",
  "#45f7b0",
  "#0d8aeb",
  "#f59300",
  "#6b20c5",
  "#26c583",
];

const getGradientId = (index) => `pieGradient${index}`;

const VotingPowerChart = ({
  data,
  title = "Voting Power Distribution",
  showHeader = true,
  innerRadius = 60,
  outerRadius = 100,
}) => {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;

    return (
      <div className="bg-base-100 shadow-lg rounded-lg p-3 border border-base-300">
        <p className="text-sm mb-1 text-gray-300">
          {name.length > 24
            ? `${name.substring(0, 8)}...${name.substring(name.length - 4)}`
            : name}
        </p>
        <p className="font-medium text-white">
          {value.toFixed(2)}% of voting power
        </p>
      </div>
    );
  };

  const CustomLegend = ({ payload }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm mt-8">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-gray-400 truncate">
            {entry.value.length > 24
              ? `${entry.value.substring(0, 8)}...${entry.value.substring(
                  entry.value.length - 4
                )}`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-base-200 p-6 rounded-lg hover:bg-base-300/70 transition-all duration-200">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1fa1ff]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#1fa1ff]" />
            </div>
            <h3 className="font-medium text-gray-200">{title}</h3>
          </div>
          <div className="text-sm text-gray-400">
            Total Members: {data.length}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="w-full" style={{ height: "400px", marginTop: "24px" }}>
          {" "}
          <ResponsiveContainer>
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              {" "}
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient
                    key={getGradientId(index)}
                    id={getGradientId(index)}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${getGradientId(index % COLORS.length)})`}
                    className="hover:opacity-80 transition-opacity"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default VotingPowerChart;
