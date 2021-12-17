import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import shrinkAddress from "../../helpers/shrinkAddress";

export default function RepositorySelector({
  repositories,
  currentRepo = { name: "", id: null },
  disabled = false,
  onClick = () => {},
  ...props
}) {
  const [filteredList, setFilteredList] = useState([]);
  const [selected, setSelected] = useState(currentRepo);
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef();

  useEffect(() => {
    setFilteredList(repositories);
    setSearchText("");
  }, [repositories]);

  useEffect(() => {
    setSelected(currentRepo);
  }, [currentRepo]);

  useEffect(() => {
    const list = repositories.filter((l) => l.name.includes(searchText));
    setFilteredList(list);
  }, [searchText]);

  return (
    <div className="dropdown" tabIndex={disabled ? null : "0"}>
      <div
        className={
          "btn btn-sm items-center" +
          (disabled ? " btn-disabled" : " btn-outline")
        }
        onClick={() => {
          if (searchInput) searchInput.current.focus();
        }}
      >
        <div className="flex-1 text-left px-2">
          {selected.owner ? shrinkAddress(selected.owner.id) + "/" : ""}
          {selected.name}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="shadow-lg dropdown-content bg-base-300 rounded mt-1 overflow-hidden w-64">
        <div className="mx-4 mt-4">
          <div className="form-control">
            <div className="relative">
              <input
                name={"repository-search"}
                type="text"
                placeholder={"Search repositories"}
                className="w-full pr-16 input input-sm input-ghost input-bordered"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.code === "Escape") {
                    setSearchText("");
                  }
                  if (e.code === "Enter") {
                    if (filteredList.length) {
                      setSelected(filteredList[0]);
                    }
                  }
                }}
                ref={searchInput}
              />
              <button className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost">
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
              </button>
            </div>
          </div>
        </div>
        <ul className="menu text-xs mt-2">
          {filteredList.map((b, i) => {
            return (
              <li key={"repository-selector" + i}>
                <a
                  className="whitespace-nowrap"
                  onClick={() => {
                    setSelected(b);
                    onClick(b);
                  }}
                >
                  {b.owner ? shrinkAddress(b.owner.id) + "/" : ""}
                  {b.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
