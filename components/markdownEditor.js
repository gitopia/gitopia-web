import { useState, useEffect } from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";

function MarkdownEditor(props) {
  const [selectedTab, setSelectedTab] = useState("write");
  let properties;
  props.property
    ? (properties = props.property)
    : (properties = "text-neutral");
  return (
    <div className={properties}>
      <ReactMde
        value={props.value}
        onChange={props.setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        minEditorHeight={120}
        generateMarkdownPreview={(markdown) => {
          return Promise.resolve(
            <div className="markdown-body px-2 py-4">
              <ReactMarkdown linkTarget="_blank">{markdown}</ReactMarkdown>
            </div>
          );
        }}
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
      />
    </div>
  );
}

export default MarkdownEditor;
