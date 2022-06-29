const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    let favoriteBlogIndex = 0;
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > blogs[favoriteBlogIndex].likes) {
            favoriteBlogIndex = i;
        }
    }

    const favoriteBlogObject = {
        title: blogs[favoriteBlogIndex].title,
        author: blogs[favoriteBlogIndex].author,
        likes: blogs[favoriteBlogIndex].likes
    };

    return favoriteBlogObject;
};

const totalLikes = (blogs) => {
    const sum = blogs.reduce((accumulator, value) => {
        return accumulator + value.likes;
    }, 0);
    return sum;
};

const dummy = (blogs) => {
    return 1;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};
