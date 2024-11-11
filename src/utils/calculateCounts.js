export const calculateEmojiCounts = ({ emojiList, post_id }) => {
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
        if (emoji.post_id === post_id) {
            // console.log("vo day");
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

export const calculateFavoriteCounts = ({ favoriteList, post_id }) => {
    let totalCount = 0;

    if (!favoriteList) {
        return {
            totalCount,
        };
    }
    favoriteList.forEach(favorite => {
        console.log("favorite", favorite);
        console.log("post_id", post_id);
        if (favorite.post_id === post_id) {
            totalCount += 1;
        }
    });

    return {
        totalCount,
    };
};
