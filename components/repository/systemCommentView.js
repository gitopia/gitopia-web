import ReactMarkdown from "react-markdown";
import { commentType } from "../../helpers/systemCommentTypeClass";

function SystemCommentView({ comment = { creator: "" }, ...props }) {
  return (
    <div className="flex w-full" key={"comment" + comment.id}>
      <div className="flex-none mr-4 w-10"></div>
      <div className="flex-none w-12 relative pt-5 flex items-center justify-center">
        {commentType[comment.commentType] ? (
          <div className="w-6 h-6 z-10 relative top-px">
            {commentType[comment.commentType]}
          </div>
        ) : (
          <div className="border border-grey rounded-full w-6 h-6 bg-base-100 z-10 relative top-px"></div>
        )}
        <div className="border-l border-grey h-1/2 absolute left-1/2 top-0 z-0"></div>
      </div>
      <div className="flex-1 text-xs text-type-secondary pr-4 pt-6 break-words w-5 sm:w-96">
        <ReactMarkdown linkTarget="_blank">{comment.body}</ReactMarkdown>
      </div>
    </div>
  );
}

export default SystemCommentView;
