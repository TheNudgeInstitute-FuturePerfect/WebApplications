function Pagination({ currentPage, totalPages, totalDocuments, paginate }) {
  const pages = () => {
    if (totalPages > 10)
      if (currentPage > 5 && currentPage < totalPages - 5 + 1)
        return [
          ...Array.from(
            { length: 5 },
            (value, index) => index + currentPage - 5
          ),
          "...",
          ...Array.from(
            { length: 5 },
            (value, index) => index + totalPages - 5
          ),
        ];
      else
        return [
          ...Array.from({ length: 5 }, (value, index) => index),
          "...",
          ...Array.from(
            { length: 5 },
            (value, index) => index + totalPages - 5
          ),
        ];
    else return Array.from({ length: totalPages }, (value, index) => index);
  };
  return (
    <div className="mt-1 text-center">
      <div
        className={`d-inline-block border p-2 me-1 mt-1 cursor-pointer${
          currentPage === 1 ? " text-secondary" : " text-primary"
        }`}
        onClick={() => (currentPage === 1 ? null : paginate(1))}
      >
        First
      </div>
      <div
        className={`d-inline-block border p-2 me-1 mt-1 cursor-pointer${
          currentPage === 1 ? " text-secondary" : " text-primary"
        }`}
        onClick={() => (currentPage === 1 ? null : paginate(currentPage - 1))}
      >
        Previous
      </div>
      {pages().map((element, index) => (
        <div
          key={index}
          className={`d-inline-block border p-2 me-1 mt-1 cursor-pointer${
            currentPage === element + 1
              ? " bg-primary text-light"
              : " text-primary"
          }`}
          onClick={() =>
            currentPage === element + 1
              ? null
              : element === "..."
              ? null
              : paginate(element + 1)
          }
        >
          {element === "..." ? element : element + 1}
        </div>
      ))}
      <div
        className={`d-inline-block border p-2 me-1 mt-1 cursor-pointer${
          currentPage === totalPages ? " text-secondary" : " text-primary"
        }`}
        onClick={() =>
          currentPage === totalPages ? null : paginate(currentPage + 1)
        }
      >
        Next
      </div>
      <div
        className={`d-inline-block border p-2 me-1 mt-1 cursor-pointer${
          currentPage === totalPages ? " text-secondary" : " text-primary"
        }`}
        onClick={() =>
          currentPage === totalPages ? null : paginate(totalPages)
        }
      >
        Last
      </div>
    </div>
  );
}

export default Pagination;
