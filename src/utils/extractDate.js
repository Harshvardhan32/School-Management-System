const extractDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}

const extractDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}

export default extractDate;