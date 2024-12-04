const Table = ({ column, renderRow, data }) => {

    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-left text-gray-500 text-sm dark:text-gray-200">
                    {column?.map((col) => (
                        <th key={col.accessor}
                            className={col.className}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data?.map((item) => renderRow(item))}
            </tbody>
        </table>
    );
}

export default Table;