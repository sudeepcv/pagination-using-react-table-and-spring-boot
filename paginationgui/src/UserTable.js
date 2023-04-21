import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTable, usePagination } from "react-table";

function UserTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  const fetchData = async ({ pageIndex, pageSize }) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/users", {
        params: {
          page: pageIndex,
          size: pageSize,
        },
      });

      const { content: jsonData, totalPages: newPageCount } = response.data;
      if (Array.isArray(jsonData)) {
        setData(jsonData);
        setPageCount(newPageCount);
      } else {
        throw new Error("Data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Avatar",
        accessor: "pictureUrl",
        Cell: ({ value }) => (
          <img src={value} alt="avatar" style={{ height: "50px" }} />
        ),
      },
      { Header: "First Name", accessor: "firstName" },
      { Header: "Last Name", accessor: "lastName" },
      { Header: "Gender", accessor: "gender" },
      { Header: "Age", accessor: "age" },
      { Header: "Email", accessor: "email" },
    ],
    []
  );
  const tableInstance = useTable(
    { columns, data, manualPagination: true, pageCount },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    prepareRow,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [pageIndex, pageSize]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <table {...getTableProps()} className="table table-striped">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className="pagination mt-3"
        style={{ display: "flex", alignItems: "center" }}
      >
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          style={{ marginRight: "10px" }}
        >
          {"<<"}
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          style={{ marginRight: "10px" }}
        >
          {"<"}
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          style={{ marginRight: "10px" }}
        >
          {">"}
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          style={{ marginRight: "10px" }}
        >
          {">>"}
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span style={{ marginLeft: "10px" }}>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={async (e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              console.log("pageNumber", pageNumber);
              gotoPage(pageNumber);
            }}
            style={{ width: "50px", marginLeft: "5px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ marginLeft: "10px" }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default UserTable;
