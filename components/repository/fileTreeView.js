import { useEffect, useState, useCallback } from "react";
import CheckboxTree from "react-checkbox-tree";
import find from "lodash/find";

export default function FileTreeView({ onShowFile = () => {}, ...props }) {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [searchFilesText, setSearchFilesText] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

  const addLeaf = (siblings, segments, parentValue) => {
    let [chunk, ...rest] = segments;
    let found = find(siblings, { label: chunk }),
      node = {
        value: parentValue ? parentValue + "/" + chunk : chunk,
        label: chunk,
        showCheckbox: false,
      };
    if (found) {
      node.value = found.value + "/" + chunk;
      if (found.children) {
        if (rest.length) {
          addLeaf(found.children, rest, found.value);
        } else {
          found.children.push(node);
        }
      } else {
        if (rest.length) {
          found.children = [];
          addLeaf(found.children, rest, found.value);
        } else {
          found.children = [node];
        }
      }
    } else {
      if (rest.length) {
        node.children = [];
        addLeaf(node.children, rest, node.value);
      }
      siblings.push(node);
    }
  };

  const compactifyTree = (node) => {
    if (node.children) {
      node.children.map((n) => compactifyTree(n));
      if (node.children.length === 1 && node.children[0].children) {
        node.value = node.children[0].value;
        node.label = node.label
          ? node.label + "/" + node.children[0].label
          : node.children[0].label;
        node.children = node.children[0].children;
      }
    }
  };

  const filterNodes = (filtered, node) => {
    const children = (node.children || []).reduce(filterNodes, []);
    if (
      node.label
        .toLocaleLowerCase()
        .indexOf(searchFilesText.toLocaleLowerCase()) > -1
    ) {
      filtered.push({ ...node });
    } else if (children.length) {
      filtered.push({ ...node, children });
    }

    return filtered;
  };

  useEffect(() => {
    if (!searchFilesText) {
      setFilteredFiles(allFiles);
    } else {
      setFilteredFiles(allFiles.reduce(filterNodes, []));
    }
  }, [searchFilesText, allFiles]);

  useEffect(() => {
    console.log("recalc nodes");
    if (props.pathList) {
      let nodes = [];
      props.pathList.map((path) => {
        if (path!== "") addLeaf(nodes, path.split("/"));
      });
      nodes.map((n) => compactifyTree(n));
      setAllFiles(nodes);
    }
  }, [props.pathList]);

  return (
    <>
      <div className="relative my-2">
        <input
          name="search-changed-files"
          className="input input-sm input-bordered w-full pl-8"
          placeholder="Filter changed files"
          value={searchFilesText}
          onChange={(e) => {
            setSearchFilesText(e.target.value);
          }}
        />
        <div className="absolute left-2 top-2 ml-px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <CheckboxTree
        nodes={filteredFiles}
        checked={checked}
        expanded={expanded}
        onCheck={(checked) => setChecked(checked)}
        onExpand={(expanded) => setExpanded(expanded)}
        onClick={(node) => {
          if (node.isLeaf) {
            onShowFile(node.value);
          }
        }}
        expandOnClick={true}
        icons={{
          check: "",
          uncheck: "",
          halfCheck: "",
          expandClose: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          ),
          expandOpen: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          ),
          parentClose: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="4 4 16 16"
              fill="currentColor"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          ),
          parentOpen: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              />
            </svg>
          ),
          leaf: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          ),
        }}
      />
    </>
  );
}
