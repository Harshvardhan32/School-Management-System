const TableSearch = () => {

    return (
        <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <img src="/search.png" alt="" className="w-[14px] h-[14px]" />
            <input
                type="text"
                placeholder="Search..."
                className="outline-none w-[200px] bg-transparent dark:text-gray-200 py-2"
            />
        </div>
    );
}

export default TableSearch;