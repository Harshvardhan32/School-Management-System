const extractDateTime = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

    return `${formattedDate} | ${formattedTime}`;
};

export default extractDateTime;