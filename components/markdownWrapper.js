import ReactMarkdown, { uriTransformer } from "react-markdown";
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
        transformLinkUri={(href, children, title) => {
          let sanitizedUrl = uriTransformer(href);
          if (
            !sanitizedUrl.includes(":") &&
            !(sanitizedUrl.startsWith("#") || sanitizedUrl.startsWith(".")) &&
            props.hrefBase
          ) {
            let finalUrl = props.hrefBase + "/" + sanitizedUrl;
            return finalUrl;
          }
          return sanitizedUrl;
        }}
        transformImageUri={(src, alt, title) => {
          let sanitizedUrl = uriTransformer(src);
          if (
            sanitizedUrl.includes(":") &&
            sanitizedUrl.startsWith(process.env.NEXT_PUBLIC_SERVER_URL)
          ) {
            let finalUrl = sanitizedUrl
              .replace(
                new RegExp("^" + process.env.NEXT_PUBLIC_SERVER_URL),
                "/api"
              )
              .replace(new RegExp("/blob/|/tree/"), "/raw/");
            return finalUrl;
          } else if (props.hrefBase) {
            let finalUrl =
              "/api" +
              props.hrefBase.replace(new RegExp("/blob/|/tree/"), "/raw/") +
              "/" +
              sanitizedUrl;
            return finalUrl;
          }
          return sanitizedUrl;
        }}
      >
        {props.children}
      </ReactMarkdown>
    </div>
  );
}
