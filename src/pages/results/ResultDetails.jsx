import { useLocation } from "react-router-dom";
import ResultChart from "../../components/ResultChart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAResult } from "../../services/operations/resultAPI";

const ResultDetails = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const resultId = location.pathname.split('/').at(-1);
    const { token } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAResult(resultId, token));
    }, [token, resultId]);

    const { resultDetails } = useSelector(state => state?.result);

    const subjectResults = resultDetails?.subjectResults.map((result) => ({
        subject: result.subject.subjectName,
        exams: result.examResults.map((item) => ({
            exam: item.exam.examName,
            score: item.score,
            maxScore: item.maxScore,
            percentage: item.percentage,
            grade: item.grade
        })),
        subjectGrade: result.subjectGrade
    }));

    return (
        <div className="flex flex-col gap-4 mx-4">
            {/* Top */}
            <div className="flex flex-col gap-4 lg:flex-row">
                {/* Student Information Section */}
                <div className="w-full lg:w-[25%] bg-white dark:bg-slate-900 p-6 rounded-[6px] shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <p className="text-xl font-medium dark:text-gray-200 mb-4">Student Exam Results</p>
                    <div className="flex flex-col gap-4 dark:text-gray-200">
                        <p className="text-base"><span className="font-medium">Student Name: </span>{resultDetails?.student.userId.firstName} {resultDetails?.student.userId.lastName}</p>
                        <p><span className="font-medium">Class: </span>{resultDetails?.classId.className}</p>
                        <p><span className="font-medium">Overall Percentage: </span><span className="text-2xl font-bold text-[#51DFC3]">{resultDetails?.overallPercentage}%</span></p>
                        <p><span className="font-medium">Remarks: </span>{resultDetails?.remarks}</p>
                    </div>
                </div>

                {/* Results Chart Section */}
                <div className="w-full lg:w-[75%] bg-white dark:bg-slate-900 rounded-[6px] shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out h-[500px]">
                    <ResultChart subjectResults={subjectResults || []} />
                </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col gap-8 bg-white dark:bg-slate-900 p-4 rounded-[6px] shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <p className="text-xl font-medium dark:text-gray-200">Result Details</p>
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="dark:text-gray-200">
                        <tr>
                            <th className="py-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Subject</th>
                            <th className="py-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Exam</th>
                            <th className="py-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Score</th>
                            <th className="py-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Max Score</th>
                            <th className="py-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Percentage</th>
                            <th className="py-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Grade</th>
                            <th className="py-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Subject Grade</th>
                        </tr>
                    </thead>
                    <tbody className="dark:text-gray-200">
                        {subjectResults?.map((subjectResult) => {
                            return subjectResult.exams.map((exam, index) => (
                                <tr key={`${subjectResult.subject}-${index}`} className="text-center">
                                    {/* Merge the 'Subject' column */}
                                    {index === 0 && (
                                        <td
                                            rowSpan={subjectResult.exams.length}
                                            className="py-3 border-2 border-gray-300 font-medium"
                                        >
                                            {subjectResult.subject}
                                        </td>
                                    )}
                                    <td className="py-3 border-2 border-gray-300">{exam.exam}</td>
                                    <td className="py-3 border-2 border-gray-300">{exam.score}</td>
                                    <td className="py-3 border-2 border-gray-300">{exam.maxScore}</td>
                                    <td className="py-3 border-2 border-gray-300">{exam.percentage}</td>
                                    <td className="py-3 border-2 border-gray-300">{exam.grade}</td>
                                    {index === 0 && (
                                        <td
                                            rowSpan={subjectResult.exams.length}
                                            className="py-3 border-2 border-gray-300 font-medium"
                                        >
                                            {subjectResult.subjectGrade}
                                        </td>
                                    )}
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ResultDetails;