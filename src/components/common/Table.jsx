import React, { useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const Table = ({ columns, data }) => {

    // Memoizing columns to avoid unnecessary re-renders
    const memoizedColumns = useMemo(() => {
        return columns.map((column) => ({
            ...column,
            disableSortBy: !column.isSortable, // Disable sorting for columns marked as non-sortable
        }));
    }, [columns]);

    // Using React Table hooks for table functionality and sorting
    const {
        rows, headerGroups, getTableProps, getTableBodyProps, prepareRow,
    } = useTable({ columns: memoizedColumns, data }, useSortBy);

    return (
        <table
            {...getTableProps()} // Assigning table-level props
            className="w-full mt-4"
        >
            <thead>
                {/* Rendering table headers */}
                {headerGroups.map((headerGroup, i) => {
                    const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                    return (
                        <tr key={key || i} {...restHeaderGroupProps}>
                            {headerGroup.headers.map((column, j) => {
                                const { key, ...restHeaderProps } = column.getHeaderProps(
                                    !column.disableSortBy ? column.getSortByToggleProps() : {} // Adding sorting props if applicable
                                );
                                return (
                                    <th
                                        key={key || j}
                                        {...restHeaderProps}
                                        className={`flex gap-1 items-center p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 ${column.className || ""
                                            }`}
                                    >
                                        {column.render("Header")} {/* Rendering header label */}
                                        <span className="flex flex-col">
                                            {/* Displaying sorting icons */}
                                            {(!column.disableSortBy && column.isSorted) ? column.isSortedDesc
                                                ? <TiArrowSortedUp fontSize={18} className="inline" />
                                                : <TiArrowSortedDown fontSize={18} className="inline" />
                                                : ''
                                            }
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    );
                })}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white dark:bg-gray-900">
                {rows.length > 0 ? (
                    rows.map((row, rowIndex) => {
                        prepareRow(row); // Preparing each row for rendering
                        const { key, ...restRowProps } = row.getRowProps();
                        return (
                            <tr
                                key={key || `row-${rowIndex}`}
                                {...restRowProps}
                                className={`${rowIndex % 2 !== 0
                                    ? "bg-white dark:bg-slate-900"
                                    : "bg-slate-100 dark:bg-slate-800"
                                    } border-b dark:hover:bg-gray-700 hover:bg-purple-50`}
                            >
                                {row.cells.map((cell, cellIndex) => {
                                    const { key, ...restCellProps } = cell.getCellProps();
                                    const columnClassName =
                                        cell.column.className || "";
                                    return (
                                        <td
                                            key={key || `cell-${rowIndex}-${cellIndex}`}
                                            {...restCellProps}
                                            className={`p-4 text-sm text-gray-700 dark:text-gray-300 ${columnClassName}`}
                                        >
                                            {cell.render("Cell")} {/* Rendering cell content */}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })
                ) : (
                    // Display message if no data is available
                    <tr>
                        <td
                            colSpan={memoizedColumns.length}
                            className="p-4 text-center text-gray-500 dark:text-gray-400"
                        >
                            No data available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;