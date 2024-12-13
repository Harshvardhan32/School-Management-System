import React, { useMemo } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTable, useSortBy } from "react-table";

const Table = ({ columns, data }) => {

    const memoizedColumns = useMemo(() => {
        return columns.map((column) => ({
            ...column,
            disableSortBy: !column.isSortable,
        }));
    }, [columns]);

    const {
        rows, headerGroups, getTableProps, getTableBodyProps, prepareRow,
    } = useTable({ columns: memoizedColumns, data, }, useSortBy);

    return (
        <table
            {...getTableProps()}
            className="w-full mt-4"
        >
            <thead>
                {headerGroups.map((headerGroup, i) => {
                    const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                    return (
                        <tr key={key || i} {...restHeaderGroupProps}>
                            {headerGroup.headers.map((column, j) => {
                                const { key, ...restHeaderProps } = column.getHeaderProps(
                                    !column.disableSortBy ? column.getSortByToggleProps() : {}
                                );
                                return (
                                    <th
                                        key={key || j}
                                        {...restHeaderProps}
                                        className={`flex gap-1 items-center p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 ${column.className || ""
                                            }`}
                                    >
                                        {column.render("Header")}
                                        <span className="flex flex-col">
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
                        prepareRow(row);
                        const { key, ...restRowProps } = row.getRowProps();
                        return (
                            <tr
                                key={key || `row-${rowIndex}`}
                                {...restRowProps}
                                className={`${rowIndex % 2 !== 0
                                    ? "bg-slate-50 dark:bg-slate-900"
                                    : "bg-white dark:bg-slate-800"
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
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })
                ) : (
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