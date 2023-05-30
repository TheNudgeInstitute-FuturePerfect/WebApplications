function Pagination({ currentPage, totalPages, totalDocuments, paginate }) {
  return (
    <div className="mt-2 text-center">
      <div
        className={`d-inline-block border p-2 me-1${
          currentPage === 1 ? " text-secondary" : " text-primary"
        }`}
        onClick={() => (currentPage === 1 ? null : paginate(1))}
      >
        First
      </div>
      <div
        className={`d-inline-block border p-2 me-1${
          currentPage === 1 ? " text-secondary" : " text-primary"
        }`}
        onClick={() => (currentPage === 1 ? null : paginate(currentPage - 1))}
      >
        Previous
      </div>
      {Array.from(Array(totalPages || currentPage).keys()).map((element) => (
        <div
          className={`d-inline-block border p-2 me-1${
            currentPage === element + 1
              ? " bg-primary text-light"
              : " text-primary"
          }`}
          onClick={() =>
            currentPage === element + 1 ? null : paginate(element + 1)
          }
        >
          {element + 1}
        </div>
      ))}
      <div
        className={`d-inline-block border p-2 me-1${
          currentPage === totalPages ? " text-secondary" : " text-primary"
        }`}
        onClick={() =>
          currentPage === totalPages ? null : paginate(currentPage + 1)
        }
      >
        Next
      </div>
      <div
        className={`d-inline-block border p-2 me-1${
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
