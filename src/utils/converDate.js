export const handleTime = ({ timestamp }) => {
    const now = Date.now(); // Current time in milliseconds
    const secondsAgo = Math.floor((now - timestamp) / 1000); // Difference in seconds

    if (secondsAgo < 60) {
        return `${secondsAgo} giây trước`;
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return `${minutesAgo} phút trước`;
    } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return `${hoursAgo} giờ trước`;
    } else {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return `${daysAgo} ngày trước`;
    }
}

export const formatDate = ({ timestamp }) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}`;
}