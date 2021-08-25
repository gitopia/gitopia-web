import _ from "lodash";
export default function getHomeUrl(dashboards, currentDashboard) {
  const home = _.find(dashboards, (d) => d.id === currentDashboard);
  return home ? home.url : "/home";
}
