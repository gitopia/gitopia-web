// TODO: Get all labels applicable for issues for a repository

export default async function issueAllLabels(repoId) {
  return [
    {
      id: 0,
      name: "bug",
      description: "Something isn't working",
      color: "#B60205",
      selected: false,
    },
    {
      id: 1,
      name: "documentation",
      description: "Improvements or additions to documentation",
      color: "#0052CC",
      selected: false,
    },
    {
      id: 2,
      name: "help wanted",
      description: "Extra attention is needed",
      color: "#085141",
      selected: false,
    },
    {
      id: 3,
      name: "enhancement",
      description: "New feature or request",
      color: "#BFD4F2",
      selected: false,
    },
    {
      id: 4,
      name: "wontfix",
      description: "This will not be worked on",
      color: "#BFD4F2",
      selected: false,
    },
  ];
}
