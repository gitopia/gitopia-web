import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownWrapper(props) {
  return (
    <div
      onClick={(e) => {
        let targetHref = e.target.href;
        if (targetHref) {
          let parsedHref = targetHref.split("#")[1];
          let elem = document.querySelector(
            "#user-content-" + parsedHref + " a[href='#" + parsedHref + "']"
          );
          if (elem) {
            elem.scrollIntoView({
              behavior: "smooth",
            });
          }
        }
      }}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeSanitize]}
      >
        {props.children}
      </ReactMarkdown>
    </div>
  );
}
