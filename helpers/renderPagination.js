export default function renderPagination(pagination, setPage, page) {
  const { total, limit } = pagination;
  const noOfPages = Math.ceil(total / limit);
  const beforePage =
    page >= 2 ? (
      <button
        className="btn btn-sm"
        onClick={() => {
          setPage(page - 1);
        }}
      >
        {page - 1}
      </button>
    ) : (
      ""
    );
  const firstPage =
    page >= 3 && noOfPages >= 3 ? (
      <button
        className="btn btn-sm"
        onClick={() => {
          setPage(1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mt-px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    ) : (
      ""
    );
  const afterPage =
    noOfPages - page >= 1 ? (
      <button
        className="btn btn-sm"
        onClick={() => {
          setPage(page + 1);
        }}
      >
        {page + 1}
      </button>
    ) : (
      ""
    );
  const lastPage =
    noOfPages - page >= 2 && noOfPages >= 3 ? (
      <button
        className="btn btn-sm"
        onClick={() => {
          setPage(noOfPages);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mt-px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    ) : (
      ""
    );
  const previousPage =
    page >= 2 ? (
      <button
        className="btn btn-sm"
        onClick={() => {
          setPage(page - 1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mt-px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    ) : (
      <button className="btn btn-sm btn-disabled">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mt-px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );

  const nextPage =
    noOfPages - page >= 1 ? (
      <button
        className="btn btn-sm"
        onClick={() => {
          setPage(page + 1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mt-px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    ) : (
      <button className="btn btn-sm btn-disabled">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mt-px"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  return (
    <>
      {firstPage}
      {previousPage}
      {beforePage}
      <button className="btn btn-sm btn-active">{page}</button>
      {afterPage}
      {nextPage}
      {lastPage}
    </>
  );
}
