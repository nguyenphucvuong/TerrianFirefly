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
const post = [
    {
        idPost: "1",
        idUser: "1",
        createAt: " 1 giờ trước - Honkai",
        title: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
    aperiam exercitationem aliquid, repellendus quae alias dolores
    eligendi ea beatae vitae quis doloremque quibusdam, molestias
    non. Perspiciatis nemo laudantium rerum laboriosam.`,
        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
    aperiam exercitationem aliquid, repellendus quae alias dolores
    eligendi ea beatae vitae quis doloremque quibusdam, molestias
    non. Perspiciatis nemo laudantium rerum laboriosam.`,
        images: [
            "https://upload-os-bbs.hoyolab.com/upload/2024/05/12/111816991/034be374ffb331e6b0dbc16ed3c0fbf6_933372970025389044.jpg",
        ],
        hashtag: [
            "Honkai Impact 3rd",
            "Mihoyo",
            "Honkai",
            "Impact",
            "3rd",
        ],
        isYT: false,
        emoji: {
            like: "10",
            heart: "2",
            laugh: "133",
            sad: "5",
        },
        view: "12350",
    },
    {
        idPost: "1",
        idUser: "1",
        createAt: " 1 giờ trước - Honkai",
        title: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
    aperiam exercitationem aliquid, repellendus quae alias dolores
    eligendi ea beatae vitae quis doloremque quibusdam, molestias
    non. Perspiciatis nemo laudantium rerum laboriosam.`,
        content: `4kyNZjXN5xo`,
        images: [
        ],
        hashtag: [
            "Honkai Impact 3rd",
            "Mihoyo",
            "Honkai",
            "Impact",
            "3rd",
        ],
        isYT: true,
        emoji: {
            like: "10",
            heart: "2",
            laugh: "133",
            sad: "5",
        },
        view: "12350",
    },
    {
        idPost: "1",
        idUser: "1",
        createAt: " 1 giờ trước - Honkai",
        title: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
    aperiam exercitationem aliquid, repellendus quae alias dolores
    eligendi ea beatae vitae quis doloremque quibusdam, molestias
    non. Perspiciatis nemo laudantium rerum laboriosam.`,
        content: `4kyNZjXN5xo`,
        images: [
        ],
        hashtag: [
            "Honkai Impact 3rd",
            "Mihoyo",
            "Honkai",
            "Impact",
            "3rd",
        ],
        isYT: false,
        emoji: {
            like: "10",
            heart: "2",
            laugh: "133",
            sad: "5",
        },
        view: "12350",
    },
];
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
    laugh: "0",
    sad: "0",
}

const comment = {
    idComment: "1",
    idPost: "1",
    idUser: "1",
    createAt: "1 giờ trước",
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