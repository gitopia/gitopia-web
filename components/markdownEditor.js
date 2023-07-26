import { useState } from "react";
import ReactMde, { getDefaultToolbarCommands } from "react-mde";
import ReactMarkdown from "react-markdown";
import { useLazyQuery, gql } from "@apollo/client";
import client from "../helpers/apolloClient";
import shrinkAddress from "../helpers/shrinkAddress";

const QUERY = gql`
  query FindUserByUsernameQuery($search: String = "") {
    users(
      where: {
        username_contains_nocase: $search
        name_contains_nocase: $search
      }
      first: 5
    ) {
      username
      name
      creator
      avatarUrl
    }
  }
`;

function MarkdownEditor(props) {
  const [selectedTab, setSelectedTab] = useState("write");
  const [getSuggestions, suggestions] = useLazyQuery(QUERY, {
    client: client,
  });
  let properties,
    toolbarCommands = getDefaultToolbarCommands();
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
            <div className="markdown-body text-left border border-grey rounded-lg p-4 min-h-[120px]">
              <ReactMarkdown linkTarget="_blank">{markdown}</ReactMarkdown>
            </div>
          );
        }}
        loadSuggestions={(text, triggeredBy) => {
          return new Promise((resolve, reject) => {
            const fn = async () => {
              if (text !== "") {
                let res = await getSuggestions({
                  variables: { search: text },
                });
                let users = res?.data?.users || [];
                if (users.length) {
                  resolve(
                    users.map((u) => {
                      return {
                        preview: (
                          <div className="">
                            {u.name ? (
                              <div className="text-sm">{u.name}</div>
                            ) : (
                              ""
                            )}
                            <div className="text-xs text-type-secondary">
                              <span>{u.username}</span>
                              <span className="ml-2">
                                {"(" + shrinkAddress(u.creator) + ")"}
                              </span>
                            </div>
                          </div>
                        ),
                        value: "@" + u.username,
                      };
                    })
                  );
                } else {
                  resolve([
                    {
                      preview: (
                        <div className="text-sm text-type-secondary">
                          No Results
                        </div>
                      ),
                      value: null,
                    },
                  ]);
                }
              } else {
                resolve([
                  {
                    preview: (
                      <div className="text-sm text-type-secondary">Search name or username</div>
                    ),
                    value: null,
                  },
                ]);
              }
            };
            fn();
          });
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
