import { formatNumber } from "../utils/formatNumber";

const UserCard = ({ type, number }) => {

    return (
        <div className="rounded-[6px] odd:bg-[#51DFC3] even:bg-[#FF5B76] p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">2024/25</span>
                <img src="/more.png" alt="" className="w-[20px] h-[20px]" />
            </div>
            <h1 className="text-2xl font-semibold my-4">{formatNumber(number)}</h1>
            <h2 className="text-sm font-medium text-gray-700">{type}</h2>
        </div>
    );
}

export default UserCard;