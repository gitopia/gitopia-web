import find from "lodash/find";
export default function getHomeUrl(dashboards, currentDashboard) {
  const home = find(dashboards, (d) => d.id === currentDashboard);
  return home ? home.url : "/home";
}
