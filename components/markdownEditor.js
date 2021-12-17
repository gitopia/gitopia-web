import { useState, useEffect } from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";

function MarkdownEditor(props) {
  // const [value, setValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");

  return (
    <div className="text-neutral">
      <ReactMde
        value={props.value}
        onChange={props.setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
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
