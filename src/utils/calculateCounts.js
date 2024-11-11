export const calculateEmojiCounts = ({ emojiList, postId }) => {
    // console.log("emojiList", emojiList);
    let likeCount = 0;
    let heartCount = 0;
    let laughCount = 0;
    let sadCount = 0;
    if (!emojiList) {
        return {
            likeCount,
            heartCount,
            laughCount,
            sadCount,
        };
    }
    emojiList.forEach(emoji => {
        if (emoji.post_id === postId) {
            console.log("vo day");
            likeCount += emoji.count_like;
            heartCount += emoji.count_heart;
            laughCount += emoji.count_laugh;
            sadCount += emoji.count_sad;
        }
    });
    const totalCount = likeCount + heartCount + laughCount + sadCount;
    return {
        likeCount,
        heartCount,
        laughCount,
        sadCount,
        totalCount,
    };
};

export const calculateFavoriteCounts = ({ favoriteList, postId }) => {
    let totalCount = 0;

    if (!favoriteList) {
        return {
            totalCount,
        };
    }
    favoriteList.forEach(favorite => {
        if (favorite.post_id === postId) {
            totalCount += 1;
        }
    });

    return {
        totalCount,
    };
};
