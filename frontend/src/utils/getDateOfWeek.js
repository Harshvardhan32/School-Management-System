export const getDateOfWeek = (dayOfWeek, referenceDate = new Date()) => {
    const daysOfWeekMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    };

    const referenceDay = referenceDate.getDay();
    const difference = daysOfWeekMap[dayOfWeek] - referenceDay;
    const targetDate = new Date(referenceDate);
    targetDate.setDate(referenceDate.getDate() + difference);
    return targetDate;
}