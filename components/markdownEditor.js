import { useState } from "react";
import ReactMde, {getDefaultToolbarCommands}  from "react-mde";
import ReactMarkdown from "react-markdown";

function MarkdownEditor(props) {
  const [selectedTab, setSelectedTab] = useState("write");
  let properties, toolbarCommands = getDefaultToolbarCommands();
  props.property
    ? (properties = props.property)
    : (properties = "text-neutral");
  toolbarCommands[0] = toolbarCommands[0].slice(0, 3); // remove strikethrough
  return (
    <div className={properties}>
      <ReactMde
        value={props.value}
        onChange={props.setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        minEditorHeight={120}
        minPreviewHeight={110}
        toolbarCommands={toolbarCommands}
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
