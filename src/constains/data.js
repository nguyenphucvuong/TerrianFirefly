let text = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
  aperiam exercitationem aliquid, repellendus quae alias dolores
  eligendi ea beatae vitae quis doloremque quibusdam, molestias
  non. Perspiciatis nemo laudantium rerum laboriosam.`;
text = text.substring(0, 120);

let texts = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
  aperiam exercitationem aliquid, repellendus quae alias dolores
  eligendi ea beatae vitae quis doloremque quibusdam, molestias
  non. Perspiciatis nemo laudantium rerum laboriosam.`;

const user = {
    idUser: "1",
    userId: "1",
    userName: "Cá Voi",
    avatar: "https://vnn-imgs-a1.vgcloud.vn/vnreview.vn/image/11/44/57/1144578.jpg",
    hashtag: [
    ],
};
const post = {
    idPost: "1",
    idUser: "1",
    creatAt: " 1 giờ trước - Honkai",
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
    aperiam exercitationem aliquid, repellendus quae alias dolores
    eligendi ea beatae vitae quis doloremque quibusdam, molestias
    non. Perspiciatis nemo laudantium rerum laboriosam.`,
    images: [
        "https://upload-os-bbs.hoyolab.com/upload/2024/05/12/111816991/034be374ffb331e6b0dbc16ed3c0fbf6_933372970025389044.jpg",
        "https://upload-os-bbs.hoyolab.com/upload/2024/05/14/184133439/dd0fd8f3fd576a0142658de44ac859f7_1810763935896167165.jpg",
        "https://upload-os-bbs.hoyolab.com/upload/2024/05/01/283700571/d214ba18907113f365ccf11acac7360d_8045971794910383490.jpg",
        "https://upload-os-bbs.hoyolab.com/upload/2024/07/03/318782826/47cb4ff0db4ca986c6775cc66d10493f_5811412000668980395.png?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70",

        "https://upload-os-bbs.hoyolab.com/upload/2024/05/12/111816991/034be374ffb331e6b0dbc16ed3c0fbf6_933372970025389044.jpg",
        "https://upload-os-bbs.hoyolab.com/upload/2024/05/01/283700571/d214ba18907113f365ccf11acac7360d_8045971794910383490.jpg",
        "https://upload-os-bbs.hoyolab.com/upload/2024/05/14/184133439/dd0fd8f3fd576a0142658de44ac859f7_1810763935896167165.jpg",
    ],
    hashtag: [
        "Honkai Impact 3rd",
        "Mihoyo",
        "Honkai",
        "Impact",
        "3rd",
    ],
    emoji: {
        like: "10",
        heart: "2",
        laugh: "133",
        sad: "5",
    },
    view: "12350",
};
const hashtagPost = {
    idHashtag: "1",
    idPost: "1",
};

const hashtag = {
    idHashtag: "1",
    hashtag: "Honkai Impact 3rd",
};

const hashtagUser = {
    idHashtag: "1",
    idUser: "1",
};
const emoji = {
    idPost: "1",
    userId: "1",
    like: "0",
    heart: "0",
    laugh: "1",
    sad: "0",
}

const comment = {
    idComment: "1",
    idPost: "1",
    idUser: "1",
    creatAt: "1 giờ trước",
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum`,
}




export const data = {
    post: post,
    user: user,
    emoji: emoji,
    comment: comment,
    hashtag: hashtag,
    hashtagPost: hashtagPost,
    hashtagUser: hashtagUser,
    texts: texts,
    text: text,
}