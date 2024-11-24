export const calculateEmojiCounts = ({ emojiList, post_id, comment_id, sub_comment_id }) => {
    // console.log("emojiList", emojiList);
    // console.log("comment_id", comment_id);
    // console.log("sub_comment_id", sub_comment_id);
    // console.log("post_id", post_id);

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
        // console.log("emoji.comment_id === comment_id", emoji.comment_id === comment_id);
        // console.log("post_id", post_id);
        // console.log("comment_id", comment_id);
        // console.log("sub_comment_id", sub_comment_id);
        // console.log("emoji.post_id === post_id", emoji.post_id === post_id);
        // console.log("emoji.comment_id === comment_id", emoji.comment_id === comment_id);
        // console.log("emoji.sub_comment_id === sub_comment_id", emoji.sub_comment_id === sub_comment_id);
        if (emoji.post_id === post_id) {
            // console.log("vo day post_id");
            likeCount += emoji.count_like;
            heartCount += emoji.count_heart;
            laughCount += emoji.count_laugh;
            sadCount += emoji.count_sad;
        }
        else if (emoji.comment_id === comment_id) {
            // console.log("vo day comment_id");
            likeCount += emoji.count_like;
            heartCount += emoji.count_heart;
            laughCount += emoji.count_laugh;
            sadCount += emoji.count_sad;
        }
        else if (emoji.sub_comment_id === sub_comment_id) {
            // console.log("vo day sub_comment_id");
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
        // console.log("favorite", favorite);
        // console.log("post_id", post_id);
        if (favorite.post_id === post_id) {
            totalCount += 1;
        }
    });

    return {
        totalCount,
    };
};
