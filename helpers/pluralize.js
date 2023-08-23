export default function pluralize(name, count) {
  switch (name) {
    case "branch":
      return Number(count) == 1 ? "branch" : "branches";
    case "tag":
      return Number(count) == 1 ? "tag" : "tags";
    case "comment":
      return Number(count) == 1 ? "comment" : "comments";
    case "commit":
      return Number(count) == 1 ? "commit" : "commits";
    case "file":
      return Number(count) == 1 ? "file" : "files";
    case "person":
      return Number(count) == 1 ? "person" : "people";
    case "pull request":
      return Number(count) == 1 ? "pull request" : "pull requests";
    case "issue":
      return Number(count) == 1 ? "issue" : "issues";
    case "attachment":
      return Number(count) == 1 ? "attachment" : "attachments";
  }
  return "";
}
