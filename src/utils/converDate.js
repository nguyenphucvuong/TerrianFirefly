export const handleTime = ({ post }) => {
    const now = Date.now(); // Current time in milliseconds
    const secondsAgo = Math.floor((now - post.created_at) / 1000); // Difference in seconds

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