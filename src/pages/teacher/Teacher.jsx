import BigCalender from "../../components/BigCalender";
import Announcements from "../../components/Announcements";

const Teacher = () => {

    return (
        <div className="w-[98.5%] p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3 flex flex-col gap-8 pr-4">
                <div className="min-h-[1200px] h-full bg-white rounded-[6px] p-4">
                    <h1 className="text-xl font-semibold">Schedule</h1>
                    <BigCalender />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Announcements />
            </div>
        </div>
    );
}

export default Teacher;