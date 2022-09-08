export default function AssigneeGroup({ assignees, ...props }) {
  return (
    <div className="space-x-2">
      {assignees.map((a, i) => (
        <div
          className="avatar tooltip tooltip-bottom"
          key={"assignee" + i}
          data-tip={a}
          data-test="selected_assignee"
        >
          <div className="w-8 h-8 rounded-full">
            <a href={"/" + a} target="_blank" className="btn-primary">
              <img
                src={
                  "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                  a.slice(-1)
                }
              />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
