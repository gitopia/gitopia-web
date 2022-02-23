export default function pullRequestStateClass(state) {
  switch (state) {
    case "OPEN":
      return "green-900";
    case "MERGED":
      return "purple-900";
    case "CLOSED":
      return "red-900";
  }
  return "";
}
