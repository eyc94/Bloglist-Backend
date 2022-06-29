const totalLikes = (blogs) => {
    const sum = blogs.reduce((accumulator, value) => {
        return accumulator + value.likes;
    }, 0);
};

const dummy = (blogs) => {
    return 1;
};

module.exports = {
    dummy,
    totalLikes
};
