import ReactMarkdown from "react-markdown";

function SystemCommentView({ comment = { creator: "" }, ...props }) {
  return (
    <div className="flex w-full pt-8" key={comment.id}>
      <div className="flex-none mr-4 w-10"></div>
      <div className="border border-grey rounded flex-1 markdown-body">
        <ReactMarkdown>{comment.body}</ReactMarkdown>
      </div>
    </div>
  );
}

export default SystemCommentView;
