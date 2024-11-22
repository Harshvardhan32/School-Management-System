const extractDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
    const formattedTime = `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes()
        .toString()
        .padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;
    return `${formattedDate} | ${formattedTime}`;
};

export default extractDateTime;