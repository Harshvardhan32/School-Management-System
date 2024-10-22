const Pagination = () => {

    return (
        <div className=" py-4 flex items-center justify-between text-gray-500">
            <button disabled className="py-2 px-4 mr-2 rounded-[6px] bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                Prev
            </button>
            <div className="flex items-center gap-2 text-sm">
                <button className="px-2 rounded-sm bg-lamaGreen text-gray-800">1</button>
                <button className="px-2 rounded-sm">2</button>
                <button className="px-2 rounded-sm hidden sm:block">3</button>
                <button className="px-2 rounded-sm hidden sm:block">4</button>
                ...
                <button className="px-2 rounded-sm">10</button>
            </div>
            <button className="py-2 px-4 ml-2 rounded-[6px] bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                Next
            </button>
        </div>
    );
}

export default Pagination;