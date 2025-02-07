import { useContext } from "react";
import { ThemeContext } from "../utils/ThemeContext";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const ResultChart = ({ subjectResults }) => {

    // Aggregate exams with the same name (e.g., "Mid Term")
    const aggregatedData = subjectResults.reduce((acc, subject) => {
        subject?.exams?.forEach((exam) => {
            const existingExam = acc.find((item) => item.name === exam.exam);

            if (existingExam) {
                existingExam[subject.subject] = exam.percentage; // Add percentage for this subject
            } else {
                acc.push({
                    name: exam.exam, // Exam name as group
                    [subject.subject]: exam.percentage, // Subject and its percentage
                });
            }
        });
        return acc;
    }, []);

    const { darkMode } = useContext(ThemeContext);

    const styles = {
        backgroundColor: `${darkMode ? '#0F172A' : '#fff'}`,
        color: `${darkMode ? '#fff' : '#000'}`,
        padding: '10px',
        borderRadius: '5px',
        borderColor: 'lightgray'
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[6px] w-full h-full p-4">
            <h1 className="text-lg font-semibold dark:text-gray-200">Exam Results</h1>
            <div className="w-full h-full py-1">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={aggregatedData}
                        barSize={25}
                        barCategoryGap={30}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                        <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                        <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                        <Tooltip contentStyle={styles} />
                        <Legend
                            align="left"
                            verticalAlign="top"
                            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
                        />
                        {/* Bars for each subject */}
                        {subjectResults.map((subject, index) => (
                            <Bar
                                key={index}
                                dataKey={subject.subject}
                                fill={index % 2 === 0 ? "#51DFC3" : "#FF5B76"} // Alternate bar colors
                                legendType="circle"
                                radius={[15, 15, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ResultChart;