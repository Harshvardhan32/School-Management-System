export const extractDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCDate().toString().padStart(2, "0")}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCFullYear()}`;
}

export const extractDateReverse = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}